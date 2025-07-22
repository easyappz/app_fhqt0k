import React, { useState, useEffect } from 'react';
import { instance } from '../api/axios';
import './UserProfile.css';
import './PhotoFilters.css';
import { updatePhotoFilters } from '../api/photoApi';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ url: '', gender: '', age: '' });
  const [editingPhoto, setEditingPhoto] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPhotos();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await instance.get('/api/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPhotos = async () => {
    try {
      const response = await instance.get('/api/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    try {
      await instance.post('/api/photos', newPhoto);
      setNewPhoto({ url: '', gender: '', age: '' });
      fetchUserPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const togglePhotoStatus = async (id, isActive) => {
    try {
      await instance.post(`/api/photos/${id}/${isActive ? 'deactivate' : 'activate'}`);
      fetchUserPhotos();
    } catch (error) {
      console.error('Error toggling photo status:', error);
    }
  };

  const handleEditFilters = (photo) => {
    setEditingPhoto({ ...photo });
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
  };

  const handleSaveFilters = async () => {
    try {
      await updatePhotoFilters(editingPhoto._id, {
        gender: editingPhoto.gender,
        age: editingPhoto.age
      });
      fetchUserPhotos();
      setEditingPhoto(null);
    } catch (error) {
      console.error('Error updating photo filters:', error);
    }
  };

  return (
    <div className="user-profile">
      {user && (
        <div className="user-info">
          <h2>Профиль пользователя</h2>
          <p>Имя: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Баллы: {user.points}</p>
        </div>
      )}

      <div className="photo-upload">
        <h3>Загрузить новую фотографию</h3>
        <form onSubmit={handlePhotoUpload}>
          <input
            type="text"
            placeholder="URL фотографии"
            value={newPhoto.url}
            onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
          />
          <select
            value={newPhoto.gender}
            onChange={(e) => setNewPhoto({...newPhoto, gender: e.target.value})}
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
          <input
            type="number"
            placeholder="Возраст"
            value={newPhoto.age}
            onChange={(e) => setNewPhoto({...newPhoto, age: e.target.value})}
          />
          <button type="submit">Загрузить</button>
        </form>
      </div>

      <div className="photo-list">
        <h3>Ваши фотографии</h3>
        {photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={photo.url} alt="Фотография пользователя" />
            <p>Статус: {photo.isActive ? 'Оценивается' : 'Не оценивается'}</p>
            <button onClick={() => togglePhotoStatus(photo._id, photo.isActive)}>
              {photo.isActive ? 'Деактивировать' : 'Активировать'}
            </button>
            <p>Всего оценок: {photo.totalRatings}</p>
            <p>Средняя оценка: {photo.averageScore.toFixed(2)}</p>
            {editingPhoto && editingPhoto._id === photo._id ? (
              <div className="photo-filters">
                <h4>Редактировать фильтры</h4>
                <select
                  value={editingPhoto.gender}
                  onChange={(e) => setEditingPhoto({...editingPhoto, gender: e.target.value})}
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другой</option>
                </select>
                <input
                  type="number"
                  placeholder="Возраст"
                  value={editingPhoto.age}
                  onChange={(e) => setEditingPhoto({...editingPhoto, age: e.target.value})}
                />
                <button onClick={handleSaveFilters}>Сохранить</button>
                <button onClick={handleCancelEdit}>Отмена</button>
              </div>
            ) : (
              <button onClick={() => handleEditFilters(photo)}>Изменить фильтры</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;