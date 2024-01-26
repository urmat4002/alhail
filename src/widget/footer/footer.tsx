import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import { WhatsApp } from '../../shared/ui/icons/whats-app/whats-app';
import { Typography } from '../../shared/ui/typography/typography';
import style from './footer.module.scss';
import { Link } from 'react-router-dom';
import { GuldemLogo } from '../../shared/ui/icons/guldem-logo/guldem-logo';


const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer__container}>
          <Link to="/">
            <GuldemLogo />
          </Link>
        <div className={style.footer__center}>
          <div>
            <ul>
              <li>Dubai</li>
              <li>Istanbul</li>
              <li>Antalya</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Villas</li>
              <li>Apartments</li>
              <li>Duplexes</li>
              <li>Plots</li>
              <li>Stores</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Buy</li>
              <li>Commercial</li>
              <li>Place an ad</li>
            </ul>
          </div>
        </div>
        <div className={style.footer__right}>
          <div className={style.footer__link}>
            <Typography variant="h2" weight="bold">
              Contact us:
            </Typography>
            <a href="info@gulsdem.com">
              <Mail />
              <Typography variant="caption" weight="regular">
                info@gulsdem.com
              </Typography>
            </a>
            <a href="tel:9021267890900">
              <Phone />
              <Typography variant="caption" weight="regular">
                +90 (212) 67890900
              </Typography>
            </a>
          </div>
          <div className={style.footer__contact}>
            <a href="#">
              <Facebook />
            </a>
            <a href="#">
              <Instagram />
            </a>
            <a href="#">
              <WhatsApp color="white" size={28} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
