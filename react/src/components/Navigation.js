import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/rate">Оценка фото</Link></li>
        <li><Link to="/profile">Профиль</Link></li>
        <li><Link to="/login">Вход</Link></li>
        <li><Link to="/register">Регистрация</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;