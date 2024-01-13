import style from './image-grid-home.module.scss';
import { Right } from '../../../shared/icons/right-left/right';
import { Left } from '../../../shared/icons/right-left/left';

const ImageGridHome = () => {
  return (
    <div className={style["igh"]}>
      <div className={style["igh__container"]}>
        <div className={style["igh__title"]}>
          <h2>Наши объекты</h2>
        </div>
        <div className={style["igh__img"]}>
          <div className={style["igh__img_item_pc"]}>
            <img src='' alt='' />
            <h3>Dubai</h3>
          </div>
          <div className={style["igh__img_wrapper"]}>
            <div className={style["igh__img_item"]}>
              <img src='' alt='' />
              <h3>Antalya</h3>
            </div>
            <div className={style["igh__img_item_mb"]}>
              <img src='' alt='' />
              <h3>Dubai</h3>
            </div>
            <div className={style["igh__img_item"]}>
              <img src='' alt='' />
              <h3>Istanbul</h3>
            </div>
          </div>
        </div>
        <div className={style["igh__left_right"]}>
          <div className={style["igh__left"]}>
            <Left />
          </div>
          <div className={style["igh__right"]}>
            <Right />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGridHome