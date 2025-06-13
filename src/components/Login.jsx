import React, { useState } from 'react';
import '../style/admin/login.css';

const Login = ({ onLogin, onClose }) => {
  const [formData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      localStorage.setItem('isAdmin', 'true');
      onLogin && onLogin(true);
      onClose && onClose();
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <div className="login-overlay" >
      <div className="login-modal">
        <div className="login-header">
          <h2>Вход в админ панель</h2>
          
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username">Логин</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              placeholder="Введите логин"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Введите пароль"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>          
          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;