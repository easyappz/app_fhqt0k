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

// Upload new photo
router.post('/photos', verifyToken, async (req, res) => {
  try {
    const { url, gender, age } = req.body;
    const photo = new Photo({
      url,
      uploadedBy: req.user._id,
      gender,
      age,
    });
    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add photo to rating list
router.post('/photos/:id/activate', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.uploadedBy.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    photo.isActive = true;
    await photo.save();
    res.json({ message: 'Photo activated for rating', photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop rating for a photo
router.post('/photos/:id/deactivate', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.uploadedBy.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    photo.isActive = false;
    await photo.save();
    res.json({ message: 'Photo deactivated from rating', photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get photo statistics
router.get('/photos/:id/stats', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    if (photo.uploadedBy.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const totalRatings = photo.ratings.length;
    const averageScore = photo.ratings.reduce((acc, curr) => acc + curr.score, 0) / totalRatings;
    res.json({ totalRatings, averageScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random photo for rating
router.get('/photos/random', verifyToken, async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const user = await User.findById(req.user._id);
    if (user.points < 1) {
      return res.status(403).json({ error: 'Not enough points to rate' });
    }
    const filter = {
      isActive: true,
      uploadedBy: { $ne: req.user._id },
      'ratings.user': { $ne: req.user._id },
    };
    if (gender) filter.gender = gender;
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }
    const photo = await Photo.findOne(filter).sort({ 'ratings.length': 1 });
    if (!photo) {
      return res.status(404).json({ error: 'No photos available for rating' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
