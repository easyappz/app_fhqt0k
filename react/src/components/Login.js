import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await instance.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    }
  };

  return (
    <div className="auth-form">
      <h2>Вход</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;