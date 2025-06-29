import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import logo from '../style/assets/logo.svg';
import '../style/admin/admin.css';
import authApi from '../api/auth';

import StaffPage from './AdminPages/StaffPage';
import ProgramsPage from './AdminPages/ProgramsPage';
import ProjectsPage from './AdminPages/ProjectsPage';
import ProductPage from './AdminPages/ProductPage';
import Login from '../components/Login';

const NavItem = ({ text, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick(); 
  };

  return (
    <div className="nav-item" onClick={handleClick}>
      {text}
    </div>
  );
};

const Navbar = ({ isOpen, toggleMenu }) => {
  const navItems = [ 
    { text: 'Проекты', path: '/admin/projects' },
    { text: 'Программы', path: '/admin/programs' },
    { text: 'Персонал', path: '/admin/staff' },
    { text: 'Продукт', path: '/admin/products' },
   
  ];

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" onClick={toggleMenu}>
          <img src={logo} alt="Banner" className="admin-logo" />
        </Link>
      </div>

      <nav className={`sidebar-nav`}>
        <div className="nav-header">
          <span>Меню навигации</span>
          {navItems.map((item, index) => (
            <NavItem 
              key={index} 
              text={item.text} 
              path={item.path} 
              onClick={toggleMenu}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

const AdminLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await authApi.getProfile();
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        console.log('Ошибка аутентификации:', error);
      }
    };

    checkAuthentication();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = (success) => {
    if (success) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 300);
    }
  };

  return (
    <div className="admin-layout">
      {isLoggedIn && (
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span className="burger-bar-admin"></span>
          <span className="burger-bar-admin"></span>
          <span className="burger-bar-admin"></span>
        </button>
      )}

      <Navbar isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`} 
          onClick={toggleMobileMenu}
        />
      )}

      <div className="admin-content">
        {!isLoggedIn && (
          <div className={`login-wrapper ${isAnimatingOut ? 'login-exit-animation' : ''}`}>
            <Login onLogin={handleLogin}/>
          </div>
        )}

        {isLoggedIn && (
          <div className="fade-container enter">
            <Routes>
              <Route path="staff" element={<StaffPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="products" element={<ProductPage />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;