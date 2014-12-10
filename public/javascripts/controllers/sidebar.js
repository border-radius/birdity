var _ = require('lodash');

module.exports = function ($scope, $rootScope, Chats, $location, $timeout) {

  $rootScope.user = {
    id: 1,
    name: 'безумный пользователь',
    userpic: 'http://i.imgur.com/9KIYE30.jpg'
  };

  $rootScope.quotes = [];

  $rootScope.changeTab = (function () {
    return function (tab) {
      if (!_.find($scope.tabs, function (_tab) {
        return _tab.id == tab.id;
      })) {
        $scope.tabs.push(tab);
      }
    };
  })();

  if ($rootScope.user) $scope.tabs = Chats.query();

  $scope.close = function (tab) {
    var question = (tab.type == 'user')
      ? 'Заблокировать пользователя ' + tab.text + '?'
      : 'Отписаться от чата?';

    if (confirm(question)) {
      Chats.remove({
        id: tab.id
      });

      $scope.tabs = $scope.tabs.filter(function (_tab) {
        return tab.id != _tab.id;
      });

      //workaround http://stackoverflow.com/questions/23867590/angularjs-location-url-doesnt-work-location-href-works
      //(location not changing if $scope.$apply() is already running)
      $timeout(function () {
        $location.url('/');
      });
    }
  };
};