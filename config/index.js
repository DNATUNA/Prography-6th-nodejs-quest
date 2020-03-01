require('dotenv').config();
const env = process.env;

const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_DEVELOPMENT,
  host: env.MYSQL_HOST,
  dialect: env.MYSQL_DIALECT,
  port: env.MYSQL_PORT,
  operatorsAliases: env.SEQUELIZE_OPERATORS_BOOLEAN
};

const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_PRODUCTION,
  host: env.MYSQL_HOST,
  dialect: env.MYSQL_DIALECT,
  port: env.MYSQL_PORT,
  operatorsAliases: env.SEQUELIZE_OPERATORS_BOOLEAN
};

const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_TEST,
  host: env.MYSQL_HOST,
  dialect: env.MYSQL_DIALECT,
  port: env.MYSQL_PORT,
  operatorsAliases: env.SEQUELIZE_OPERATORS_BOOLEAN
};

module.exports = { development, production, test };