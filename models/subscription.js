"use strict";

module.exports = function (sequelize, DataTypes) {
  var Subscription = sequelize.define("Subscription", {
    unread: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        Subscription.belongsTo(models.User);
        Subscription.belongsTo(models.Chat);
      }
    }
  });

  return Subscription;
};