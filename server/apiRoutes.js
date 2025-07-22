const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./server');

const router = express.Router();

// User model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  points: { type: Number, default: 100 },
});

const User = mongoose.model('User', UserSchema);

// Photo model
const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  age: { type: Number },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number },
  }],
  totalRatings: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
});

const Photo = mongoose.model('Photo', PhotoSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Existing routes...

// Rate a photo
router.post('/photos/:id/rate', verifyToken, async (req, res) => {
  try {
    const { score } = req.body;
    const photo = await Photo.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (!photo.isActive) {
      return res.status(400).json({ error: 'Photo is not active for rating' });
    }

    if (user.points < 1) {
      return res.status(403).json({ error: 'Not enough points to rate' });
    }

    const existingRating = photo.ratings.find(rating => rating.user.toString() === req.user._id);
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }

    photo.ratings.push({ user: req.user._id, score });
    photo.totalRatings += 1;
    photo.averageScore = (photo.averageScore * (photo.totalRatings - 1) + score) / photo.totalRatings;

    user.points -= 1;
    const photoOwner = await User.findById(photo.uploadedBy);
    photoOwner.points += 1;

    await Promise;
    await user.save();
    await photoOwner.save();

    res.json({ message: 'Photo rated successfully', photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user points
router.get('/user/points', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;