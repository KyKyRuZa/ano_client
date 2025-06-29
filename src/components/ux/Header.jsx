import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../style/assets/logo.svg';
import projectsAPI from '../../api/project';
import programsAPI from '../../api/program';
import productAPI from '../../api/product';
import '../../style/home/header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [product, Setproduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const prevPathnameRef = React.useRef(null);
  const isInitialMount = React.useRef(true);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, programsData, productData] = await Promise.all([
          projectsAPI.getAll(),
          programsAPI.getAll(),
          productAPI.getAll(),
        ]);
        setProjects(projectsData || []);
        setPrograms(programsData || []);
        Setproduct(productData || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setProjects([]);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isOpen]);

  // Компонент выпадающего меню
  const DropdownMenu = ({ title, type, data }) => (
    <Link
      className="link"
      onMouseEnter={() => setActiveDropdown(type)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {title}
      <div className={`dropdown-menu ${activeDropdown === type ? 'show' : ''}`}>
        {loading ? (
          <div className="dropdown-loading">Загрузка...</div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <Link
              key={item.id}
              to={`/${type}/${item.id}`}
              onClick={() => {
                setActiveDropdown(null);
                setIsOpen(false);
              }}
            >
              {item.title || item.name || `${title.slice(0, -1)} ${item.id}`}
            </Link>
          ))
        ) : (
          <div className="dropdown-empty">{`${title} не найдены`}</div>
        )}
      </div>
    </Link>
  );

  return (
    <header className="header">
      <nav className="navbar">
        <div className="burger-menu" onClick={toggleMenu}>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
        </div>

        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/">
            <img src={logo} alt="Banner" className="burger-logo" />
          </Link>
          <span>Меню навигации</span>
          <DropdownMenu title="Проекты" type="project" data={projects} />
          <DropdownMenu title="Программы" type="program" data={programs} />
          <DropdownMenu title="Продукты" type="product" data={product} />
          <Link className="link" to="/personal/">Персонал</Link>
        </ul>

        <Link to="/">
          <img src={logo} alt="Banner" className="logo" />
        </Link>

        <div className="contact-info">
          <a href="tel:+79274819037">+7-927-481-90-37</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;