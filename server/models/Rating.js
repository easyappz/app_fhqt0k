const mongoose = require('mongoose');
const { mongoDb } = require('../db');

const ratingSchema = new mongoose.Schema({
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true },
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoDb.model('Rating', ratingSchema);

module.exports = Rating;