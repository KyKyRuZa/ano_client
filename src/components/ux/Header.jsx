import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../style/assets/logo.svg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { pathname } = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen], [pathname]);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="burger-menu" onClick={toggleMenu}>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
        </div>
        
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link
            className='link'
            onMouseEnter={() => setActiveDropdown('projects')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Проекты
            <div className={`dropdown-menu ${activeDropdown === 'projects' ? 'show' : ''}`}>
              <Link to="/project/1">проект «ПОШИВОЧНЫЙ ЦЕХ»</Link>
            </div>
          </Link>
          <Link
            className='link'
            onMouseEnter={() => setActiveDropdown('programs')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Программы
            <div className={`dropdown-menu ${activeDropdown === 'programs' ? 'show' : ''}`}>
              <Link to="/program/1">программа «ПОШИВОЧНЫЙ ЦЕХ»</Link>
            </div>
          </Link>
          <Link className='link' to="/personal/">
              <div>
                О персоналии
              </div>
          </Link>
        </ul>
        
        <Link to="/"><img src={logo} alt="Banner" className="banner" /></Link>
        
        <div className="contact-info">
          <a href="tel:+79274819037">+7-927-481-90-37</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;