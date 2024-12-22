import cls from './ResumiesCard.module.scss';

export const ResumiesCard = (props: any): JSX.Element => {

    const {
        id,
        name,
        phone,
        email,
        skills,
        description,
        direction,
    } = props;

    return (
        <div className={cls.ResumiesCard}>
            <div className={cls.ResumiesCard_container}>
                <div className={cls.ResumiesCard_container_header}>
                    <h1 className={cls.name}>{name}</h1>
                    <h2>Телефон: {phone}</h2>
                    <h3>Email: {email}</h3>
                </div>
                <div>
                    <p><strong>Навыки:</strong> {skills}</p>
                    <p><strong>Описание:</strong> {description}</p>
                </div>
                <p><strong>Направление:</strong> {direction}</p>
            </div>
            <a href={`/resumes/${id}`} className={cls.detailsLink}>Открыть резюме</a>
        </div>
    );
}