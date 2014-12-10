var _ = require('lodash');

module.exports = function ($scope, $rootScope, $routeParams, $sce, $location, Chats) {

  $rootScope.currentChat = $routeParams.chat || 1;

  //workaround https://github.com/angular/angular.js/issues/1352
  $scope.trust = function (src) {
    return $sce.trustAsResourceUrl(src);
  };

  if ($rootScope.user) {
    $scope.chat = Chats.query({
      id: $rootScope.currentChat
    });
  }

  $scope.join = function (message) {
    $rootScope.changeTab({
      id: message.chatid,
      type: 'chat',
      text: message.text.substr(0, 70),
      bump: new Date().toISOString()
    });

    $rootScope.currentChat = message.chatid;

    $location.url('/' + message.chatid);
  };

  $scope.userChat = function (message) {
    if (message.userid == $rootScope.user.id) return;

    $rootScope.changeTab({
      id: message.userchat,
      type: 'user',
      text: message.username,
      bump: new Date().toISOString()
    });

    $rootScope.currentChat = message.userchat;

    $location.url('/' + message.userchat);
  };

  $scope.quote = function (message) {
    if (!window.getSelection().isCollapsed) return; //don't quote if text selected

    if ($rootScope.quotes.indexOf(message.id) > -1) {
      $rootScope.quotes = _.pull($rootScope.quotes, message.id);
    } else {
      $rootScope.quotes.push(message.id);
    }
  };
};