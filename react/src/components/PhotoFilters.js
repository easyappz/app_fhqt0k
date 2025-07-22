import React, { useState, useEffect } from 'react';
import './PhotoFilters.css';

const PhotoFilters = ({ onFilterChange }) => {
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('photoFilters'));
    if (savedFilters) {
      setGender(savedFilters.gender || '');
      setMinAge(savedFilters.minAge || '');
      setMaxAge(savedFilters.maxAge || '');
    }
  }, []);

  const handleApplyFilters = () => {
    const filters = { gender, minAge, maxAge };
    localStorage.setItem('photoFilters', JSON.stringify(filters));
    onFilterChange(filters);
  };

  return (
    <div className="photo-filters">
      <h3>Фильтры</h3>
      <div className="filter-group">
        <label htmlFor="gender">Пол:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Все</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="minAge">Минимальный возраст:</label>
        <input
          type="number"
          id="minAge"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          min="0"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="maxAge">Максимальный возраст:</label>
        <input
          type="number"
          id="maxAge"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          min="0"
        />
      </div>
      <button onClick={handleApplyFilters}>Применить фильтры</button>
    </div>
  );
};

export default PhotoFilters;