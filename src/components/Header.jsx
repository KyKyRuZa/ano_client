import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import logo from '../style/assets/logo.svg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


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
              <Link to="/project/2">проект группа «А»</Link>
              <Link to="/project/3">проект психологов «ЗНАКИ СВЕТА»</Link>
              <Link to="/project/4">проект «ЛИНГВИСТЫ»</Link>
              <Link to="/project/5">проект «БИБЛИОТЕКА»</Link>
              <Link to="/project/6">проект «НАУКА»</Link>

            </div>
          </Link>
          <Link
            className='link'
            onMouseEnter={() => setActiveDropdown('programs')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Программы
            <div className={`dropdown-menu ${activeDropdown === 'programs' ? 'show' : ''}`}>
                  <Link to="/program/1">НАСТАВНИЧЕСТВО</Link>
                  <Link to="/program/2">СОЦИАЛЬНАЯ БЕЗОПАСНОСТЬ</Link>
                  <Link to="/program/3">МЕДИА БЕЗОПАСНОСТИ И МЕДИА ГИГИЕНЫ</Link>
                  <Link to="/program/4">ДУХОВНО–НРАВСТВЕННОЕ И ГРАЖДАНСКО-ПАТРИОТИЧЕСКОГО ВОСПИТАНИЕ</Link>
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
          <Link to="admin/staff">Link</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;