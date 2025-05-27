import React from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import logo from '../style/assets/logo.svg';
import '../style/admin.css';

import StaffPage from './AdminPages/StaffPage';
import ProgramsPage from './AdminPages/ProgramsPage';
import ProjectsPage from './AdminPages/ProjectsPage';

const NavItem = ({ text, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div className="nav-item" onClick={handleClick}>
      {text}
    </div>
  );
};

const Navbar = () => {
  const navItems = [
    { text: 'Персонал', path: '/admin/staff' },
    { text: 'Программы', path: '/admin/programs' },
    { text: 'Проекты', path: '/admin/projects' },
  ];

  return (
    <div className={`sidebar`}>
      <div className="sidebar-header">
        <Link to="/">
          <img src={logo} alt="Banner" className="admin-logo" />
        </Link>
      </div>

      <nav className={`sidebar-nav`}>
        <div className="nav-header">
          <span>Меню навигации</span>
          {navItems.map((item, index) => (
            <NavItem key={index} text={item.text} path={item.path} />
          ))}
        </div>
      </nav>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="admin-content">
        <Routes>
          <Route path="staff" element={<StaffPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
