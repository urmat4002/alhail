import CardList from '../../../features/card-list-catalog/card-list-catalog';
import style from './catalog.module.scss';

const Catalog = () => {
  return (
    <div className={style.catalog}>
      <div className={style.catalog__container}>
        <CardList />
      </div>
    </div>
  );
};

export default Catalog;