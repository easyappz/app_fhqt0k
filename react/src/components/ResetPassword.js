import React, { useState } from 'react';
import instance from '../api/axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await instance.post('/api/reset-password-request', { email });
      setMessage('Ссылка для сброса пароля отправлена на ваш email');
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при отправке запроса');
    }
  };

  return (
    <div className="auth-form">
      <h2>Сброс пароля</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Отправить запрос на сброс пароля</button>
      </form>
    </div>
  );
};

export default ResetPassword;