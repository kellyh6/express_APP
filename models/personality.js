'use strict';
module.exports = function(sequelize, DataTypes) {
  var personality = sequelize.define('personality', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    post: DataTypes.STRING,
    feed: DataTypes.STRING,
    facebookId: DataTypes.INTEGER,
    facebookToken: DataTypes.STRING,
    watson: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return personality;
};