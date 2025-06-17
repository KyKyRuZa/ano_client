import React from 'react';
import HeroSection from '../components/HeroSection';
import LogosSection from '../components/LogosSection';
import MapSection from '../components/MapSection';
import About from '../components/About';
import MessageList from '../components/MessageList';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';

import '../style/global.css'
import '../style/home/header.css'
import '../style/home/footer.css'
import '../style/home/media.css'

const Home = () => {
  return (
    <>
      <Header/>
      <div>
        <HeroSection />
        <About />
        <MessageList/>
        <LogosSection />
        <MapSection />
      </div>
      <Footer/>
    </>
  );
};

export default Home;
