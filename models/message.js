"use strict";

module.exports = function (sequelize, DataTypes) {
  var Message = sequelize.define("Message", {
    /*
      Types:
      0 - Supermessage (creates Superchat),
      1 - Regular message,
      2 - Status message (joined/unblocked),
      3 - Status message (leaved/blocked)
    */
    type: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function (models) {
        Message.belongsTo(models.User);
        Message.belongsTo(models.Chat);
      }
    }
  });

  return Message;
};