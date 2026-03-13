module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {}, { timestamps: false });

  return PostTag;
};
