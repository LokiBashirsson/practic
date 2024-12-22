import { useEffect, useState } from 'react';
import api from '../../services/api';
import cls from './LogIn.module.scss';

export const LogIn = ({ dataMenu, dataUpdateFunc }: any) => {
    const [userName, setUserName] = useState('');
    const [userPass, setUserPass] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('myDataStorage');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            dataUpdateFunc({ ...dataMenu, token: parsedData.token || '' });
        }
    }, []);

    const loginfunc = async () => {
        if (!userName || !userPass) return alert('Проверьте поля');
        try {
            const dataTaker = await api.logIn(userName, userPass);
            if (dataTaker?.token) {
                localStorage.setItem('myDataStorage', JSON.stringify(dataTaker));
                dataUpdateFunc({ ...dataMenu, openLogin: 'none', token: dataTaker.token });
                alert('Вы вошли в аккаунт');
            } else {
                setError('Неверный логин или пароль');
            }
        } catch {
            setError('Ошибка при авторизации');
        }
    };

    return (
        <div className={cls.LogIn}>
            <div className={cls.container}>
                <div className={cls.container_box}>
                    <div className={cls.header}>Вход</div>
                    <div className={cls.body}>
                        <form onSubmit={(e) => { e.preventDefault(); loginfunc(); }}>
                            <input
                                type="text"
                                placeholder="Логин"
                                onChange={(e) => setUserName(e.target.value)}
                                value={userName}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                onChange={(e) => setUserPass(e.target.value)}
                                value={userPass}
                            />
                            {error && <p className={cls.error}>{error}</p>}
                            <p>Забыли пароль?</p>
                            <button className={cls.login} type="submit">Войти</button>
                            <button
                                className={cls.regin}
                                onClick={() => dataUpdateFunc({ ...dataMenu, openLogin: 'regin' })}
                                type="button"
                            >Регистрация</button>
                            <button
                                className={cls.regin}
                                onClick={() => dataUpdateFunc({ ...dataMenu, openLogin: 'none' })}
                                type="button"
                                style={{ display: dataMenu.token ? 'block' : 'none' }}
                            >Выйти</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};