import { BrowserRouter, Route, Routes } from 'react-router-dom';
import cls from './App.module.scss';
import Vakancies from './components/Vakancies/page';
import Profile from './components/Profile/page';
import { LogIn } from './__feauters/LogIn/page';
import { RegIn } from './__feauters/RegIn/page';
import { useEffect, useState } from 'react';
import { dataMenu } from './components/Profile/interfaces/dataMenu';
import Resumes from './components/Resumies/page';

function App() {

  const [dataMenu, setDataMenu] = useState<dataMenu>({
    openLogin: 'none',
    token: ''
  });

  const getMyDataStorage = (): any => {
    const storedData = localStorage.getItem('myDataStorage');
    return storedData ? JSON.parse(storedData) : null;
  };

  useEffect(() => {
    const storedData = getMyDataStorage();
    if (storedData) {
      setDataMenu((prev) => ({
        ...prev,
        token: storedData.token || ''
      }));
    }
  }, []);

  const dataUpdateFunc = (props: any) => {
    setDataMenu((prev: any) => ({ ...prev, ...props }));
  };

  const myDataStorage = getMyDataStorage();

  return (
    <BrowserRouter>
      {dataMenu.openLogin === 'login' ? (
        <LogIn dataMenu={dataMenu} dataUpdateFunc={dataUpdateFunc} />
      ) : dataMenu.openLogin === 'regin' ? (
        <RegIn dataMenu={dataMenu} dataUpdateFunc={dataUpdateFunc} />
      ) : null}

      <header className={cls.header}>
        <div className={cls.head_border}>
          <div className={cls.head_border_box}>
            <div className={cls.head_border_box_left}>Dev <span>Teams</span></div>
            <div className={cls.head_border_box_right}>
              <a href="/profile">Профиль</a>
              <a href="/vakancies">Вакансии</a>
              {myDataStorage?.role === 'job_seeker' ? <a href="/resumes">Резюме</a>
                : <a href="/otkliks">Отклики</a>}
              <button
                type="button"
                onClick={() => {
                  if (myDataStorage?.username) {
                    localStorage.removeItem('myDataStorage');
                    setDataMenu({ openLogin: 'login', token: '' });
                  } else {
                    dataUpdateFunc({ openLogin: 'login' });
                  }
                }}
              >
                {myDataStorage ? 'Выйти' : 'Войти'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={cls.main}>
        <Routes>
          <Route path="/profile" element={<Profile dataMenu={dataMenu} dataUpdateFunc={dataUpdateFunc} />} />
          <Route path="/vakancies" element={<Vakancies />} />
          <Route path="/vakancies/*" element={<Vakancies />} />
          <Route path="/resumes" element={<Resumes />} />
        </Routes>
      </main>

      <footer className={cls.footer}></footer>
    </BrowserRouter>
  );
}

export default App;