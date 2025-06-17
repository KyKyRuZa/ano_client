import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Programs from './pages/Programs';
import StaffPage from './pages/Staff';
import Admin from './pages/Admin';
import AdminLayout from './pages/Admin';
import ScrollToTop from './components/ScrollToUp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserAgreement from './pages/UserAgreement';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-agreement" element={<UserAgreement />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/program/:id" element={<Programs />} />
            <Route path="/personal/" element={<StaffPage/>}></Route> 
            <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
