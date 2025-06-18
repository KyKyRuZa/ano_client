import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
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
import NotFound from './pages/NotFound';


const AppContent = () => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isDisclaimerConfirmed, setIsDisclaimerConfirmed] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Проверяем, является ли текущий путь валидным маршрутом
  const validRoutes = [
    { path: '/', exact: true },
    { path: '/user-agreement', exact: true },
    { path: '/privacy-policy', exact: true },
    { path: '/personal/', exact: true },
    { path: '/project/:id', exact: false },
    { path: '/program/:id', exact: false },
    { path: '/admin', exact: true },
    { path: '/admin/*', exact: false }
  ];

  const isValidRoute = validRoutes.some(route => 
    matchPath({ path: route.path, exact: route.exact }, location.pathname)
  );

  const isNotFoundPage = !isValidRoute;

  useEffect(() => {
    const storedAnimationState = sessionStorage.getItem('animationComplete');
    const storedDisclaimerState = sessionStorage.getItem('disclaimerConfirmed');

    if (isAdminRoute) {
      setIsDisclaimerConfirmed(true);
      setIsAnimationComplete(true);
      sessionStorage.setItem('animationComplete', 'true');
      sessionStorage.setItem('disclaimerConfirmed', 'true');
    } else if (isNotFoundPage) {
      setIsDisclaimerConfirmed(true);
      setIsAnimationComplete(true);
    } else {
      const savedAnimationComplete = storedAnimationState === 'true';
      const savedDisclaimerConfirmed = storedDisclaimerState === 'true';

      setIsDisclaimerConfirmed(savedDisclaimerConfirmed);
      setIsAnimationComplete(savedAnimationComplete);

      if (!savedAnimationComplete) {
        const animationTimeout = setTimeout(() => {
          if (!isAnimationComplete) {
            setIsAnimationComplete(true);
            sessionStorage.setItem('animationComplete', 'true');
          }
        }, 10000);

        return () => clearTimeout(animationTimeout);
      }
    }
  }, [isAdminRoute, location, isNotFoundPage]);

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    sessionStorage.setItem('animationComplete', 'true');
  };

  const handleDisclaimerConfirm = () => {
    setIsDisclaimerConfirmed(true);
    sessionStorage.setItem('disclaimerConfirmed', 'true');
  };

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && !isNotFoundPage && !isDisclaimerConfirmed && (
        <Disclaimer onConfirm={handleDisclaimerConfirm} />
      )}

      {!isAdminRoute &&
        !isNotFoundPage &&
        isDisclaimerConfirmed &&
        !isAnimationComplete && (
          <CircleAnimation 
            onComplete={handleAnimationComplete} 
            timeout={10000}
          />
        )}

      {(isAdminRoute || isNotFoundPage || (isDisclaimerConfirmed && isAnimationComplete)) && (
        <div className="app">
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user-agreement" element={<UserAgreement />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/program/:id" element={<Programs />} />
              <Route path="/personal/" element={<StaffPage/>} />
              <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="*" element={<NotFound />} />
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
