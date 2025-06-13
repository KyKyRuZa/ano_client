import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import LogosSection from '../components/LogosSection';
import MapSection from '../components/MapSection';
import About from '../components/About';
import CircleAnimation from '../components/CircleAnimation';
import MessageList from '../components/MessageList';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';

import '../style/global.css'
import '../style/home/header.css'
import '../style/home/footer.css'
import '../style/home/media.css'

const Home = () => {
  const [showContent, setShowContent] = useState(() => sessionStorage.getItem('hasVisited'));
  const [isAnimating, setIsAnimating] = useState(() => !sessionStorage.getItem('hasVisited'));

  useEffect(() => {
    if (!sessionStorage.getItem('hasVisited')) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setShowContent(true);
          sessionStorage.setItem('hasVisited', 'true');
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Header/>
      <div style={{ position: 'relative' }}>
        <CircleAnimation isAnimationComplete={!isAnimating} />
        <div style={{ 
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}>
          <HeroSection />
          <About />
          <MessageList/>
          <LogosSection />
          <MapSection />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
