from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

class Vacancy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500))
    posted_at = db.Column(db.String(50), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'job_seeker' or 'employer'

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'job_seeker' or 'employer'

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token}), 200

@app.route('/api/vacancies', methods=['GET', 'POST'])
def handle_vacancies():
    if request.method == 'GET':
        sort_by = request.args.get('sort_by', 'title')
        sort_order = request.args.get('sort_order', 'asc')

        if sort_by not in ['title', 'price', 'posted_at']:
            return jsonify({'error': 'Invalid sort_by parameter'}), 400
        if sort_order not in ['asc', 'desc']:
            return jsonify({'error': 'Invalid sort_order parameter'}), 400

        order = getattr(Vacancy, sort_by).asc() if sort_order == 'asc' else getattr(Vacancy, sort_by).desc()
        vacancies = Vacancy.query.order_by(order).all()

        return jsonify([{
            'id': v.id,
            'title': v.title,
            'price': v.price,
            'description': v.description,
            'posted_at': v.posted_at,
            'company_name': v.company_name
        } for v in vacancies])

    if request.method == 'POST':
        data = request.get_json()
        new_vacancy = Vacancy(
            title=data['title'],
            price=data['price'],
            description=data.get('description', ''),
            company_name=data['company_name'],
            posted_at=datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        )
        db.session.add(new_vacancy)
        db.session.commit()

        return jsonify({'message': 'Vacancy added successfully'}), 201

@app.route('/api/user/<string:username>', methods=['DELETE'])
def delete_vacancy(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    vacancy = Vacancy.query.filter_by(user_id=user.id).first()

    if vacancy:
        db.session.delete(vacancy)
        db.session.commit()
        return jsonify({'message': 'Vacancy deleted'}), 200
    return jsonify({'error': 'Vacancy not found'}), 404

@app.route('/api/me', methods=['GET'])
def me():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 403

    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = User.query.get(data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'username': user.username,
            'email': user.email,
            'role': user.role
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

@app.route('/api/vacancies/search', methods=['GET'])
def search_vacancies():
    query = request.args.get('query', '')
    sort_by = request.args.get('sort_by', 'title')
    sort_order = request.args.get('sort_order', 'asc')

    if sort_by not in ['title', 'price', 'posted_at']:
        return jsonify({'error': 'Invalid sort_by parameter'}), 400
    if sort_order not in ['asc', 'desc']:
        return jsonify({'error': 'Invalid sort_order parameter'}), 400

    vacancies_query = Vacancy.query.filter(
        (Vacancy.title.ilike(f'%{query}%')) | 
        (Vacancy.description.ilike(f'%{query}%'))
    )

    order = getattr(Vacancy, sort_by).asc() if sort_order == 'asc' else getattr(Vacancy, sort_by).desc()
    vacancies = vacancies_query.order_by(order).all()

    return jsonify([{
        'id': v.id,
        'title': v.title,
        'price': v.price,
        'description': v.description,
        'posted_at': v.posted_at,
        'company_name': v.company_name
    } for v in vacancies])
    
class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    skills = db.Column(db.String(200), nullable=True)
    description = db.Column(db.String(500), nullable=True)
    direction = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f'<Resume {self.name}>'

@app.route('/api/resumes', methods=['GET'])
def get_resumes():
    sort_by = request.args.get('sort_by', 'name')
    sort_order = request.args.get('sort_order', 'asc')

    if sort_by not in ['name', 'phone', 'email', 'skills', 'description', 'direction']:
        return jsonify({'error': 'Invalid sort_by parameter'}), 400
    if sort_order not in ['asc', 'desc']:
        return jsonify({'error': 'Invalid sort_order parameter'}), 400

    order = db.asc if sort_order == 'asc' else db.desc
    resumes = Resume.query.order_by(order(getattr(Resume, sort_by))).all()

    return jsonify([{
        'id': resume.id,
        'name': resume.name,
        'phone': resume.phone,
        'email': resume.email,
        'skills': resume.skills,
        'description': resume.description,
        'direction': resume.direction
    } for resume in resumes])

@app.route('/api/resumes', methods=['POST'])
def add_resume():
    data = request.get_json()

    if not all(field in data for field in ['name', 'phone', 'email']):
        return jsonify({'error': 'Missing required fields'}), 400

    new_resume = Resume(
        name=data['name'],
        phone=data['phone'],
        email=data['email'],
        skills=data.get('skills', ''),
        description=data.get('description', ''),
        direction=data.get('direction', '')
    )

    db.session.add(new_resume)
    db.session.commit()

    return jsonify({'message': 'Resume added successfully'}), 201
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
