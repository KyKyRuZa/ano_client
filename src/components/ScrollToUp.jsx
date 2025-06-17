import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Пропускаем первый рендер (монтирование компонента)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // Проверяем, изменился ли путь
    if (prevPathnameRef.current !== pathname) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Обновляем предыдущий путь
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
