import React from 'react';

const partnerLogos = [];
const totalPartners = 40;

for (let i = 1; i <= totalPartners; i++) {
  partnerLogos.push({
    src: require(`../style/assets/partner-${String(i).padStart(2, '0')}.png`),
    alt: `Partner ${i}`,
  });
}

const LogosSection = () => {
  return (
    <div className="logos-wrapper">
      <h2 className="logos-title">
        Наши партнеры - региональные и всероссийские волонтерские группы и организации, а также боевые братства и союзы ветеранов.
      </h2>
      <section className="logos-section">
        <div className="logos-container">
          <div className="logos-track">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="logo-box">
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
            {partnerLogos.map((logo, index) => (
              <div key={index} className="logo-box">
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogosSection;
