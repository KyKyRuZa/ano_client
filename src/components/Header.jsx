import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../style/assets/logo.svg';
import projectsAPI from '../api/projects';
import programsAPI from '../api/programs';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, programsData] = await Promise.all([
          projectsAPI.getAllProjects(),
          programsAPI.getAllPrograms()
        ]);
        setProjects(projectsData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              {loading ? (
                <div>Загрузка...</div>
              ) : projects.length > 0 ? (
                projects.map(project => (
                  <Link key={project.id} to={`/project/${project.id}`}>
                    {project.title || project.name}
                  </Link>
                ))
              ) : (
                <div>Проекты не найдены</div>
              )}
            </div>
          </Link>
          <Link
            className='link'
            onMouseEnter={() => setActiveDropdown('programs')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            Программы
            <div className={`dropdown-menu ${activeDropdown === 'programs' ? 'show' : ''}`}>
              {loading ? (
                <div>Загрузка...</div>
              ) : programs.length > 0 ? (
                programs.map(program => (
                  <Link key={program.id} to={`/program/${program.id}`}>
                    {program.title || program.name}
                  </Link>
                ))
              ) : (
                <div>Программы не найдены</div>
              )}
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
