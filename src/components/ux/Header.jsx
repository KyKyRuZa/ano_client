import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../style/assets/logo.svg';
import projectsAPI from '../../api/project';
import programsAPI from '../../api/program';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, programsData] = await Promise.all([
          projectsAPI.getAll(),
          programsAPI.getAll()
        ]);
        setProjects(projectsData || []);
        setPrograms(programsData || []);
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
  }, [isOpen, pathname]);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="burger-menu" onClick={toggleMenu}>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`burger-bar ${isOpen ? 'open' : ''}`}></span>
        </div>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/"><img src={logo} alt="Banner" className="burger-logo" /></Link>
          <span>Меню навигации</span>
          <Link className='link' onMouseEnter={() => setActiveDropdown('projects')} onMouseLeave={() => setActiveDropdown(null)}>
            Проекты
            <div className={`dropdown-menu ${activeDropdown === 'projects' ? 'show' : ''}`}>
              {loading ? (
                <div className="dropdown-loading">Загрузка...</div>
              ) : projects.length > 0 ? (
                projects.map(project => (
                  <Link 
                    key={project.id} 
                    to={`/project/${project.id}`}
                    onClick={() => {
                      setActiveDropdown(null);
                      setIsOpen(false);
                    }}
                  >
                    {project.title || project.name || `Проект ${project.id}`}
                  </Link>
                ))
              ) : (
                <div className="dropdown-empty">Проекты не найдены</div>
              )}
            </div>
          </Link>
          <Link className='link' onMouseEnter={() => setActiveDropdown('programs')} onMouseLeave={() => setActiveDropdown(null)} >
            Программы
            <div className={`dropdown-menu ${activeDropdown === 'programs' ? 'show' : ''}`}>
              {loading ? (
                <div className="dropdown-loading">Загрузка...</div>
              ) : programs.length > 0 ? (
                programs.map(program => (
                  <Link 
                    key={program.id} 
                    to={`/program/${program.id}`}
                    onClick={() => {
                      setActiveDropdown(null);
                      setIsOpen(false);
                    }}
                  >
                    {program.title || program.name || `Программа ${program.id}`}
                  </Link>
                ))
              ) : (
                <div className="dropdown-empty">Программы не найдены</div>
              )}
            </div>
          </Link>
          <Link className='link' to="/personal/">Персоналии</Link>
        </ul>
        
        <Link to="/"><img src={logo} alt="Banner" className="logo" /></Link>
        
        <div className="contact-info">
          <a href="tel:+79274819037">+7-927-481-90-37</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
