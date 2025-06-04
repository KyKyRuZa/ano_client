import React, { useState } from 'react';
import '../style/login.css';
import { Link } from 'react-router-dom';

const Login = ({ onLogin, onClose }) => {
  const [formData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    // Можно оставить, если нужно использовать в будущем
    // Сейчас не влияет ни на что
    const { name, value } = e.target;
    // setFormData(prev => ({
    //   ...prev,
    //   [name]: value
    // }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Имитация успешного входа без проверки логина/пароля
      localStorage.setItem('isAdmin', 'true');
      onLogin && onLogin(true);
      onClose && onClose();
    } catch (err) {
      // Не используется, но можно оставить заглушку
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

          {/* Ошибок нет */}
          
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