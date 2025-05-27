import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import video from '../style/assets/video.mp4';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    setTimeout(() => {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }, 100);
  };

  return (
    <section className="hero">
      <div className="video-container">
        <video 
          ref={videoRef}  
          loop 
          className="video-banner"
        >
          <source src={video} type="video/mp4" />
        </video>
        <button onClick={handlePlayPause} className="video-control">
          <FontAwesomeIcon icon={isPlaying ?  faPlay : faPause} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
