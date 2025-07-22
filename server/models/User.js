const mongoose = require('mongoose');
const { mongoDb } = require('../db');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  points: { type: Number, default: 0 }
});

const User = mongoDb.model('User', userSchema);

module.exports = User;