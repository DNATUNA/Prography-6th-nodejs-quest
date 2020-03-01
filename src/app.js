import express from 'express';
require('dotenv').config();

// 라우터 연결
const todoRouter = require('./todo');

// Sequelize 연결
const { sequelize } = require('../models');

const app = express();
sequelize.sync();

app.use('/hello-world', (req, res) => {
  res.send('hello world');
})

export default app;
