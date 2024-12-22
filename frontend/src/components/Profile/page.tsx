import { useEffect, useState } from "react";
import api from "../../services/api";
import cls from './Profile.module.scss';

const Profile = ({ dataMenu }: any) => {
    const [myData, setMyData] = useState<any | null>(null);
    const [titles, setTitles] = useState<string>('');
    const [prices, setPrices] = useState<number | string>('');
    const [email, setEmail] = useState<string>('');
    const [descriptions, setDescriptions] = useState<string>('');
    const [companyNames, setCompanyNames] = useState<string>('');

    const [resumePhone, setResumePhone] = useState<string>('');
    const [resumeSkills, setResumeSkills] = useState<string>('');
    const [resumeDescription, setResumeDescription] = useState<string>('');
    const [resumeDirection, setResumeDirection] = useState<string>('');

    useEffect(() => {
        const storedData = localStorage.getItem('myDataStorage');
        if (storedData) {
            setMyData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (dataMenu.token) {
            api.takeMyData(dataMenu.token).then((result) => {
                setMyData(result);
                localStorage.setItem('myDataStorage', JSON.stringify(result));
            });
        }
    }, [dataMenu.token]);

    const addNewVakancyFunc = async () => {
        await api.addNewVakancy(titles, +prices, descriptions, companyNames);
        setTitles('');
        setPrices('');
        setDescriptions('');
        setCompanyNames('');
    };

    const addNewResumeFunc = async () => {
        await api.addNewResume({
            name: myData?.username,
            phone: resumePhone,
            email: email,
            skills: resumeSkills,
            description: resumeDescription,
            direction: resumeDirection,
        });
        setResumePhone('');
        setResumeSkills('');
        setEmail('');
        setResumeDescription('');
        setResumeDirection('');
    };

    return (
        <div className={cls.Profile}>
            <div className={cls.Profile_AddVakancy}>
                <div className={cls.addVakancy_description}>
                    <img src="1.jpg" alt="" />
                    <ul>
                        <li>ФИО: {myData?.username}</li>
                        <li>Роль: {myData?.role === 'job_seeker' ? 'Соискатель' : 'Работодатель'}</li>
                        <li>Емайл: {myData?.email}</li>
                        <li>Номер: </li>
                        <button>Изменить</button>
                    </ul>
                </div>

                {myData?.role === 'job_seeker' ? (
                    <form className={cls.vakancies_form} onSubmit={(e) => e.preventDefault()}>
                        <p>Создание Резюме</p>
                        <input
                            type="text"
                            placeholder="Имя"
                            value={myData?.username || ''}
                            disabled
                        />
                        <input
                            type="text"
                            placeholder="Номер телефона"
                            value={resumePhone}
                            onChange={(e) => setResumePhone(e.target.value)}
                        />
                        <textarea
                            placeholder="Навыки"
                            value={resumeSkills}
                            onChange={(e) => setResumeSkills(e.target.value)}
                        />
                        <input
                            placeholder="Емайл"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <textarea
                            placeholder="Описание"
                            value={resumeDescription}
                            onChange={(e) => setResumeDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Направление"
                            value={resumeDirection}
                            onChange={(e) => setResumeDirection(e.target.value)}
                        />
                        <button type="button" onClick={addNewResumeFunc}>Отправить</button>
                    </form>
                ) : (
                    <form className={cls.vakancies_form} onSubmit={(e) => e.preventDefault()}>
                        <p>Создание Вакансии</p>
                        <input
                            type="text"
                            placeholder="Заголовок вакансии"
                            value={titles}
                            onChange={(e) => setTitles(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Цена"
                            value={prices}
                            onChange={(e) => setPrices(e.target.value)}
                        />
                        <textarea
                            placeholder="Описание вакансии"
                            value={descriptions}
                            onChange={(e) => setDescriptions(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Имя компании"
                            value={companyNames}
                            onChange={(e) => setCompanyNames(e.target.value)}
                        />
                        <button type="button" onClick={addNewVakancyFunc}>Отправить</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
