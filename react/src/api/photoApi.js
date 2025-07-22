import instance from './axios';

export const getRandomPhoto = () => {
  return instance.get('/api/photos/random');
};

export const ratePhoto = (photoId, score) => {
  return instance.post(`/api/photos/${photoId}/rate`, { score });
};

export const getUserPoints = () => {
  return instance.get('/api/user/points');
};
