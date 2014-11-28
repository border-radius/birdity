require('angular');
require('angular-resource');
require('angular-route');

var _ = require('lodash');

var app = angular.module('birdity', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/mockup/', {
		templateUrl: 'chat',
		controller: 'chat'
	}).when('/mockup/:chat', {
		templateUrl: 'chat',
		controller: 'chat'
	}).otherwise({
		redirectTo: '/mockup/'
	});

	$locationProvider.html5Mode(true);
}]);

app.factory('Chats', ['$resource', function ($resource) {
	return $resource('/api/chat/:id/');
}]);

app.factory('Users', ['$resource', function ($resource) {
	return $resource('/api/user/:id/');
}]);

app.controller('sidebar', ['$scope', '$rootScope', 'Chats', '$location', '$timeout',
	function ($scope, $rootScope, Chats, $location, $timeout) {

	$rootScope.user = {
		id: 1,
		name: 'безумный пользователь',
		userpic: 'http://i.imgur.com/9KIYE30.jpg'
	};

	$rootScope.changeTab = (function () {
		return function (tab) {
			if (!_.find($scope.tabs, function (_tab) {
				return _tab.id == tab.id;
			})) {
				$scope.tabs.push(tab);
			}
		};
	})();

	$scope.tabs = Chats.query();

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
			//(location not changing if $scope.$apply() already running)
			$timeout(function () {
				$location.url('/mockup/');
			});
		}
	};
}]);


app.controller('chat', ['$scope', '$rootScope', '$routeParams', '$sce', '$location', 'Chats',
	function ($scope, $rootScope, $routeParams, $sce, $location, Chats) {

	$rootScope.currentChat = $routeParams.chat || 1;

	//workaround https://github.com/angular/angular.js/issues/1352
	$scope.trust = function (src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.chat = Chats.query({
		id: $rootScope.currentChat
	});

	$scope.join = function (message) {
		$rootScope.changeTab({
			id: message.chatid,
			type: 'chat',
			text: message.text.substr(0, 70),
			bump: new Date().toISOString()
		});

		$rootScope.currentChat = message.chatid;

		$location.url('/mockup/' + message.chatid);
	};

	$scope.userChat = function (message) {
		if (message.userid == $rootScope.user.id) return;

		$rootScope.changeTab({
			id: message.userchat,
			type: 'chat',
			text: message.text.substr(0, 70),
			bump: new Date().toISOString()
		});

		$rootScope.currentChat = message.userchat;

		$location.url('/mockup/' + message.userchat);
	}
}]);