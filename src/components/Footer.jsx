import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faVk, faYoutube } from '@fortawesome/free-brands-svg-icons';
import logo from '../style/assets/logo.svg';
import rutub from '../style/assets/Rutube_icon.svg';
import QR from '../style/assets/QR.png';

const Footer = () => {

  return(
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <img src={logo} alt="Logo" className="footer-banner" />
          <div className="footer-social">
            <a href="https://t.me/cenim_zhizn" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a href="https://vk.com/club216517939" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faVk} />
            </a>
            <a href="https://www.youtube.com/@tsenim_zhizn" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="/">
                <img src={rutub} alt="rutube" className="rutube" />
            </a>
          </div>
          <p>Сайт создан студентами университета КИУ</p>
        </div>
        <div className='QR'>
          <div className='QR-container'> 
            <img src={QR} alt="QR" className="footer-QR" />
            <p>пожертвовать</p>
          </div>
         
        </div>
        <div className="footer-requisites">
          <p>Реквизиты:</p>
          <ul>
            <li>ИНН: 1655494610</li>
            <li>КПП: 165501001</li>
            <li>ОГРН: 1231600019705</li>
            <li>Расчётный счёт: 40703810162000004021</li>
            <li>Банк: Отделение "Банк Татарстан" №8610 ПАО Сбербанк</li>
            <li>БИК банка: 049205603</li>
            <li>Корреспондентский счёт: 30101810600000000603</li>
            <li>ИНН банка: 7707083893</li>
            <li>КПП банка: 165502001</li>
            <li>ОКПО: 95784168</li>
            <li>ОКАТО: 92401367000 Вахитовский</li>
            <li>ОКТМО: 92701000001 Казань</li>
            <li>ОКОПФ: 71400 Автономные некоммерческие организации</li>
          </ul>
        </div>
      </div>
      <div className="social-icons">
        <p>© 2023 АНБО "Ценим жизнь"</p>
      </div>
    </footer>
  );
};

export default Footer;
