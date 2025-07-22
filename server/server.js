const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const apiRoutes = require('./apiRoutes');

/** Это подключение к базе данных */
/** Никогда не удаляй этот код  */
require('./db');

const app = express();

app.use(bodyParser.json());

app.use('/api', apiRoutes);

const JWT_SECRET = 'your-secret-key';

module.exports = { app, JWT_SECRET };
