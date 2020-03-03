import express from 'express';
require('dotenv').config();

// 라우터 연결
const todoRouter = require('./router/todos');

// Sequelize 연결
const { sequelize } = require('../models');

const app = express();
const sequelizeSet = async () => {
  await sequelize.sync();
  console.log('Mysql Syned');
}

sequelizeSet();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/hello-world', (req, res) => {
  res.send('hello world');
});
app.use('/todos', todoRouter);

export default app;
