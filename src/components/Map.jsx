import React from 'react';

const MapSection = () => (
  <section className="map-section">
    <div className="container">
      <div className="map-container">
        <iframe title="Location Map"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Af1448f87ff72265c357db6b969bbf617b338fedaa066747f25ef62f905c0f245&amp;source=constructor"
          width="500"
          height="400"
          frameborder="0"
        ></iframe>
      </div>

      <div className="contact-details">
        <h2>Контактная информация</h2>
        <p>
          <strong>Адрес</strong> <br />420111 Республика Татарстан, г. Казань, ул. Московская, 15, пом. 1064, оф. 223
        </p>
        <p>
          <strong>Электронная почта</strong><br /> anotsenimzhizn@mail.ru
        </p>
        <p>
          <strong>Телефон</strong><br /> +7-927-481-90-37<br /> +7-939-365-07-19
        </p>
      </div>
    </div>
  </section>
);

export default MapSection;