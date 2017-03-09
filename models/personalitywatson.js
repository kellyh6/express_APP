'use strict';
module.exports = function(sequelize, DataTypes) {
  var personalitywatson = sequelize.define('personalitywatson', {
    personalityId: DataTypes.INTEGER,
    watsonId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return personalitywatson;
};