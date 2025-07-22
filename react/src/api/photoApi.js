import instance from './axios';

export const getRandomPhoto = (filters) => {
  return instance.get('/api/photos/random', { params: filters });
};

export const ratePhoto = (photoId, score) => {
  return instance.post(`/api/photos/${photoId}/rate`, { score });
};

export const getUserPoints = () => {
  return instance.get('/api/user/points');
};

export const updatePhotoFilters = (photoId, filters) => {
  return instance.put(`/api/photos/${photoId}/filters`, filters);
};