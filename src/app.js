import express from 'express';
require('dotenv').config();

// 라우터 연결
const todoRouter = require('./router/todos');

// Sequelize 연결
const { sequelize } = require('../models');

const app = express();

// 귺산 님의 솔루션!
// 이 코드로 jest에서 sync 문제를 해결할 수 있다.
let isInitialized = false;
app.use(async (req, res, next) => {
  if(!isInitialized) {
    await sequelize.sync();
    isInitialized = true;
  }
  next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/hello-world', (req, res) => {
  res.send('hello world');
});
app.use('/todos', todoRouter);

export default app;
