import React, { useState, useEffect } from 'react';
import { getRandomPhoto, ratePhoto, getUserPoints } from '../api/photoApi';
import PhotoFilters from './PhotoFilters';
import './PhotoRating.css';

const PhotoRating = () => {
  const [photo, setPhoto] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchRandomPhoto = async () => {
    try {
      setLoading(true);
      const response = await getRandomPhoto(filters);
      setPhoto(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить фотографию');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await getUserPoints();
      setUserPoints(response.data.points);
    } catch (err) {
      console.error('Ошибка при получении баллов пользователя:', err);
    }
  };

  useEffect(() => {
    fetchRandomPhoto();
    fetchUserPoints();
  }, [filters]);

  const handleRate = async (score) => {
    try {
      await ratePhoto(photo._id, score);
      await fetchUserPoints();
      fetchRandomPhoto();
    } catch (err) {
      setError('Ошибка при оценке фотографии');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!photo) return <div className="no-photo">Нет доступных фотографий для оценки</div>;

  return (
    <div className="photo-rating">
      <h2>Оцените фотографию</h2>
      <PhotoFilters onFilterChange={handleFilterChange} />
      <div className="photo-container">
        <img src={photo.url} alt="Фото для оценки" className="photo" />
      </div>
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((score) => (
          <button key={score} onClick={() => handleRate(score)}>{score}</button>
        ))}
      </div>
      <div className="user-points">Ваши баллы: {userPoints}</div>
    </div>
  );
};

export default PhotoRating;