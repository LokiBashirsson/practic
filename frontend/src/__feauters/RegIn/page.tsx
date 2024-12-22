import { useState } from 'react';
import api from '../../services/api';
import cls from './RegIn.module.scss';

export const RegIn = (props: any) => {

    const {
        dataMenu,
        dataUpdateFunc
    } = props;

    const [userName, serUserName] = useState<string>('');
    const [userMail, serUserMail] = useState<string>('');
    const [userPass, serUserPass] = useState<string>('');
    const [userPassR, serUserPassR] = useState<string>('');
    const [roleOpen, setRoleOpen] = useState<boolean>(false);
    const [role, setRole] = useState<'job_seeker' | 'employer'>('job_seeker');

    const registration = async () => {
        if (!userName || !userMail || !userPass || userPassR !== userPass) return alert('Проверьте поля');
        const dataTaker = await api.regIn(userName, userMail, userPass, role);
        if (dataTaker === 201) alert('Профиль создан')
        dataUpdateFunc({ ...dataMenu, openLogin: 'none' })
    }

    return (
        <div className={cls.LogIn}>
            <div className={cls.container}>
                <div className={cls.container_box}>
                    <div className={cls.header}>Регистрация</div>
                    <div className={cls.body}>
                        <form>
                            <input type="text" placeholder='Логин' onChange={(e) => serUserName(e.target.value)} value={userName} />
                            <input type="text" placeholder='Почта' onChange={(e) => serUserMail(e.target.value)} value={userMail} />
                            <div className={cls.roles} onClick={() => setRoleOpen(!roleOpen)}>Роль: <span>{role === 'job_seeker' ? 'Соискатель' : 'Работодатель'}</span>
                                <div>
                                    <div className={roleOpen ? cls.open : cls.close} onClick={() => { setRole('job_seeker'); setRoleOpen(false) }}>Соискатель</div>
                                    <div className={roleOpen ? cls.open : cls.close} onClick={() => { setRole('employer'); setRoleOpen(false) }}>Работодатель</div>
                                </div>
                            </div>
                            <input onChange={(e) => serUserPass(e.target.value)} value={userPass} type="password" placeholder='Пароль' />
                            <input onChange={(e) => serUserPassR(e.target.value)} value={userPassR} type="password" placeholder='Повторить пароль' />
                            <button className={cls.login} onClick={registration} type='button'>Регистрация</button>
                            <button className={cls.regin} onClick={() => dataUpdateFunc({ ...dataMenu, openLogin: 'login' })} type='button'>Войти</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}