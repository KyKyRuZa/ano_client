import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Project from './pages/Project';
import Programs from './pages/Programs';
import StaffPage from './pages/Staff';
import AdminLayout from './pages/Admin';
import ScrollToTop from './components/ScrollToUp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserAgreement from './pages/UserAgreement';
import Disclaimer from './components/Disclaimer';
import CircleAnimation from './components/CircleAnimation';

const AppContent = () => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isDisclaimerConfirmed, setIsDisclaimerConfirmed] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      setIsDisclaimerConfirmed(true);
      setIsAnimationComplete(true);
    }
  }, [isAdminRoute]);

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
  };

  const handleDisclaimerConfirm = () => {
    setIsDisclaimerConfirmed(true);
  };

  return (
    <>
      <ScrollToTop/>
      {!isAdminRoute && !isDisclaimerConfirmed && (
        <Disclaimer onConfirm={handleDisclaimerConfirm} />
      )}
      {!isAdminRoute && isDisclaimerConfirmed && !isAnimationComplete && (
        <CircleAnimation onComplete={handleAnimationComplete} />
      )}
      {(isAdminRoute || (isDisclaimerConfirmed && isAnimationComplete)) && (
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
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
