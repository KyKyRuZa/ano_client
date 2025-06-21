import React, { useContext,useState,useEffect } from 'react';
import { CookieContext } from '../context/CookieContext';
import '../style/cookie.css';

const CookieBanner = () => {
  const { thirdPartyEnabled, isConsentGiven, acceptAllCookies, saveCookieSettings } = useContext(CookieContext);
  const [isVisible, setIsVisible] = useState(!isConsentGiven); // скрываем, если уже дано согласие
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isConsentGiven) {
      setIsVisible(false);
    }
  }, [isConsentGiven]);

  const acceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const saveSettings = () => {
    saveCookieSettings(thirdPartyEnabled);
    setIsVisible(false);
    setIsSettingsOpen(false);
  };

  return isVisible ? (
    <div className="cookie-banner">
      {!isSettingsOpen ? (
        <>
          <p>
            Наш сайт использует файлы cookie, в том числе с привлечением сторонних сервисов (например, Яндекс),
            чтобы обеспечить корректную работу сайта, анализировать посещаемость и улучшать пользовательский опыт.
            Продолжая использовать наш сайт, вы соглашаетесь на обработку ваших персональных данных в порядке и целях,
            предусмотренных{' '}
            <a href="/privacy-policy" style={{ color: '#007bff', textDecoration: 'underline' }}>
              Политикой конфиденциальности
            </a>
            . Вы можете принять все файлы cookie или настроить их использование вручную.
          </p>
          <div className="cookie-actions">
            <button onClick={acceptAll}>Принять всё</button>
            <button onClick={() => setIsSettingsOpen(true)}>Настроить</button>
          </div>
        </>
      ) : (
        <div className="cookie-settings">
          <h4>Настройки файлов cookie</h4>
          <label>
            <input type="checkbox" disabled defaultChecked />
            Анализ данных (необходимые)
          </label>
          <label>
            <input
              type="checkbox"
              checked={thirdPartyEnabled}
              onChange={(e) => saveCookieSettings(e.target.checked)}            />
            Сторонние сервисы (например, Яндекс.Карты)
          </label>
          <div className="settings-actions">
            <button onClick={saveSettings}>Сохранить</button>
            <button onClick={() => setIsSettingsOpen(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default CookieBanner;