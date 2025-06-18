import React from 'react';
import '../style/notfound.css'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Страница, которую вы ищете, не существует.</p>
      </div>
    </div>
  );
};

export default NotFound;
