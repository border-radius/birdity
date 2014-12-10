"use strict";

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      isNull: false,
      unique: true,
      is: {
        args: ["^([A-z0-9 -]+|[А-я0-9 -]+)$", "i"],
        msg: 'Только латинские, либо только кириллические символы. Еще можно цифры, минус и пробел.'
      },
      len: {
        args: [2, 24],
        msg: 'От 2 до 24 символов'
      }
    },
    password: {
      type: DataTypes.STRING,
      isNull: false
    },
    email: {
      type: DataTypes.STRING,
      isEmail: {
        msg: 'Настоящий e-mail, пожалуйста.'
      },
      unique: true
    },
    inviteCode: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Subscription);
        User.hasMany(models.Message);
      }
    }
  });

  return User;
};