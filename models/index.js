'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


//테이블 추가
db.Todo = require('./todo')(sequelize, Sequelize);
db.Tags = require('./tags')(sequelize, Sequelize);
db.Comments = require('./comments')(sequelize, Sequelize);

//관계 설정
db.Todo.belongsToMany(db.Tags, { through: 'TodoTags' });
db.Tags.belongsToMany(db.Todo, { through: 'TodoTags' });

db.Todo.hasMany(db.Comments);
db.Comments.belongsTo(db.Todo);

module.exports = db;
