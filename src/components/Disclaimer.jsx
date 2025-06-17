import React, { useState, useEffect } from 'react';
import '../style/home/disclaimer.css';

const Disclaimer = ({ onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isConfirmed = sessionStorage.getItem('disclaimerConfirmed');
    
    if (!isConfirmed) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    sessionStorage.setItem('disclaimerConfirmed', 'true');
    
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    if (onConfirm) onConfirm();
  };

  const handleDecline = async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const regionMap = {
      'Europe/Moscow': 'https://yandex.com',
      'Europe/Kiev': 'https://google.com.ua',
      'Asia/Shanghai': 'https://baidu.com',
      'Asia/Tokyo': 'https://yahoo.co.jp',
      'Asia/Seoul': 'https://naver.com'
    };
    
    const searchEngine = regionMap[timezone] || 'https://google.com';
    window.location.href = searchEngine;
  } catch {
    window.location.href = 'https://google.com';
  }
};


  if (!isVisible) {
    return null;
  }

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-content">
        <h1>18+</h1>
        <p>
          Данный раздел сайта может содержать информацию, предназначенную для лиц, 
          достигших 18 лет. Чтобы продолжить, подтвердите достижение данного возраста.
        </p>
        <div className="disclaimer-buttons">
          <button onClick={handleConfirm}>Мне есть 18</button>
          <button onClick={handleDecline}>Нет</button>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
