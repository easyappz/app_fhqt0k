const mongoose = require('mongoose');
const { mongoDb } = require('../db');

const photoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  age: Number,
  isRated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoDb.model('Photo', photoSchema);

module.exports = Photo;