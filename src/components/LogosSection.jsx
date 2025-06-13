import React, { useRef, useEffect, useState, useMemo } from 'react';
import '../style/logos.css';

const LogosSection = () => {
  const totalPartners = 40;
  const trackRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const partnerLogos = useMemo(() => {
    return Array.from({length: totalPartners}, (_, i) => ({
      src: require(`../style/assets/partner-${String(i+1).padStart(2, '0')}.png`),
      alt: `Партнер ${i+1}`
    }));
  }, []);

  useEffect(() => {
    const images = [];
    let loadedCount = 0;

    const checkLoadCompletion = () => {
      if (loadedCount === partnerLogos.length) {
        setIsLoaded(true);
      }
    };

    partnerLogos.forEach((logo) => {
      const img = new Image();
      img.src = logo.src;
      img.onload = () => {
        loadedCount++;
        checkLoadCompletion();
      };
      images.push(img);
    });

    return () => {
      images.forEach(img => img.onload = null);
    };
  }, [partnerLogos]);

  useEffect(() => {
    if (!isLoaded || !trackRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth / 2;
    let position = 0;

    const animate = () => {
      position -= 2;

      if (Math.abs(position) >= trackWidth) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isLoaded]);

  return (
    <div className="logos-wrapper">
      <h2 class="logos-title">Наши партнеры - региональные и всероссийские волонтерские группы и организации, а также боевые братства и союзы ветеранов.</h2>
      <section className="logos-section">
        <div className="logos-container">
          <div 
            className="logos-track" 
            ref={trackRef}
          >
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div 
                key={index} 
                className="logo-box"
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  loading="lazy" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogosSection;
