"use strict";

module.exports = function (sequelize, DataTypes) {
  var Chat = sequelize.define("Chat", {
    /*
      Types:
      0 - Superchat,
      1 - Private chat,
      2 - Public chat
    */
    type: DataTypes.INTEGER,
    bump: DataTypes.DATE
  }, {
    classMethods: {
      associate: function (models) {
        Chat.hasMany(models.Subscription);
        Chat.hasMany(models.Message);
      }
    }
  });

  return Chat;
};