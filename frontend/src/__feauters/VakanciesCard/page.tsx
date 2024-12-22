import { VacanciesInterface } from '../../components/Vakancies/interafaces/VakanciesInterfaces';
import cls from './VakanciesCard.module.scss';

export const VakanciesCard = (props: VacanciesInterface): JSX.Element => {

    const {
        id,
        title,
        price,
        description,
        posted_at,
        company_name
    } = props;

    return (
        <div className={cls.VakanciesCard}>
            <div className={cls.VakanciesCard_container}>
                <h1 className={cls.title}>{title} </h1>
                <h2>{company_name}</h2>
                <span className={cls.price}>{price} ₽</span>
                <p>{posted_at}</p>
            </div>
            <a href={`/vakancies/${id}`}>Открыть</a>
        </div>
    )
}
