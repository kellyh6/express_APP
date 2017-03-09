'use strict';
module.exports = function(sequelize, DataTypes) {
  var watson = sequelize.define('watson', {
    result: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.watson.belongsToMany(models.personality, {through: models.personalitywatson});
      }
    }
  });
  return watson;
};