import { useEffect, useState } from "react";
import api from "../../services/api";
import cls from './Resumies.module.scss';
import { ResumiesCard } from "../../__feauters/ResumiesCard/page";

const Resumes = (): JSX.Element => {
    const [resumes, setResumes] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchResumes = async () => {
            setLoading(true);
            const response = await api.getAllResumes();
            setResumes(response);
        };

        fetchResumes();
    }, []);

    const handleSort = (field: string) => {
        setSortBy(field);
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className={cls.Vakancies}>
            <div className={cls.Vakancies_header}>РЕЗЮМЕ</div>

            <div className={cls.Vakancies_body}>
                {resumes ? resumes.map(r => (
                    <ResumiesCard key={r.id} {...r} />))
                    :
                    'Нет данных'
                }
            </div>
        </div>
    );
};

export default Resumes;