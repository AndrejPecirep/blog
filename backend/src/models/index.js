const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require(path.join(__dirname, '../../database'));


const db = {};

// Load models
db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Tag = require('./tag.model')(sequelize, DataTypes);
db.PostTag = require('./postTag.model')(sequelize, DataTypes);

// Asocijacije
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
