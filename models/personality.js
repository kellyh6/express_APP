'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var personality = sequelize.define('personality', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:{
          msg:"Invaild email address"
          }
        }
      },
    password:{
      type: DataTypes.STRING,
      validate:{
        len: {
          args: [4,20],
          msg:"Password must be between 4 and 20 characters long"
        }
      }
    },
    post: DataTypes.STRING,
    feed: DataTypes.STRING,
    facebookId: DataTypes.BIGINT,
    facebookToken: DataTypes.STRING,
    watson: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(createdUser, option, cb){
        if(createdUser && createdUser.password){
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash; //Change the password to the has value before instering into the db
        }
        cb(null, createdUser);
      }
    }, 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      isValidPassword: function(passwordTyped){
        return bcrypt.compareSync(passwordTyped, this.password);
      },
      toJSON: function(){
        var data = this.get();
        delete data.password;
        return data;
      }
    }    
  });
  return personality;
};