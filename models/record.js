'use strict';
module.exports = (sequelize, DataTypes) => {
  const record = sequelize.define('record', {
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    category: DataTypes.STRING,
    shop: DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {});
  record.associate = function (models) {
    // associations can be defined here
    record.belongsTo(models.User)
  };
  return record;
};