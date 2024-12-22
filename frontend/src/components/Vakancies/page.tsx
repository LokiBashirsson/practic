import { useEffect, useState } from "react";
import { VakanciesCard } from "../../__feauters/VakanciesCard/page";
import api from "../../services/api";
import { VacanciesInterface } from "./interafaces/VakanciesInterfaces";
import cls from './Vakancies.module.scss';

const Vakancies = (): JSX.Element => {
    const [vacancies, setVacancies] = useState<Array<VacanciesInterface>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<string>('title');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchVacancies = async () => {
            setLoading(true);
            try {
                const response = await api.searchVacancies(searchQuery, sortBy, sortOrder);
                setVacancies(response);
            } catch (error) {
                console.error('Error fetching vacancies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVacancies();
    }, [searchQuery, sortBy, sortOrder]);

    const handleSort = (field: string) => {
        setSortBy(field);
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className={cls.Vakancies}>
            <div className={cls.Vakancies_header}>ВАКАНСИИ</div>

            <div className={cls.Vakancies_search}>
                <input
                    type="text"
                    placeholder="Поиск по названию или описанию..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={cls.Vakancies_sort}>
                {['title', 'price', 'posted_at'].map(field => (
                    <div key={field} onClick={() => handleSort(field)}>
                        Сортировать по {field === 'title' ? 'имени' : field === 'price' ? 'цене' : 'дате публикации'}
                    </div>
                ))}
            </div>

            <div className={cls.Vakancies_body}>
                {loading ? <div>Загрузка данных...</div> :
                    vacancies.length ? vacancies.map(v => <VakanciesCard key={v.id} {...v} />) :
                        <div>Нет доступных вакансий</div>
                }
            </div>
        </div>
    );
}
export default Vakancies;