module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, { through: models.PostTag, foreignKey: 'tagId' });
  };

  return Tag;
};
