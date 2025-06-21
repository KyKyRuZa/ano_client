// context/CookieContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CookieContext = createContext();

const COOKIE_KEY = 'cookie_consent';

export const CookieProvider = ({ children }) => {
  // Состояние по умолчанию — false, если не загружено из localStorage
  const [thirdPartyEnabled, setThirdPartyEnabled] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_KEY);

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setThirdPartyEnabled(parsed.thirdPartyEnabled);
        setIsConsentGiven(true);
      } catch (e) {
        console.warn('Не удалось прочитать данные из localStorage');
      }
    }
  }, []);

  // Сохранение согласия в localStorage
  const saveConsentToLocalStorage = (enableThirdParty) => {
    const consentData = {
      thirdPartyEnabled: enableThirdParty,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consentData));
  };

  // Принять всё
  const acceptAllCookies = () => {
    setThirdPartyEnabled(true);
    setIsConsentGiven(true);
    saveConsentToLocalStorage(true);
  };

  // Сохранить настройки
  const saveCookieSettings = (enable) => {
    setThirdPartyEnabled(enable);
    setIsConsentGiven(true);
    saveConsentToLocalStorage(enable);
  };

  return (
    <CookieContext.Provider
      value={{
        thirdPartyEnabled,
        isConsentGiven,
        acceptAllCookies,
        saveCookieSettings,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};