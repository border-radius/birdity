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

app.controller('sidebar', ['$scope', '$rootScope', 'Chats', function ($scope, $rootScope, Chats) {

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
}]);


app.controller('chat', ['$scope', '$rootScope', '$routeParams', '$sce', '$location', 'Chats', 'Users',
	function ($scope, $rootScope, $routeParams, $sce, $location, Chats, Users) {

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
		
		var chat = Users.get({
			id: message.userid
		}, function () {
			$rootScope.currentChat = chat.chatid;

			$rootScope.changeTab({
				id: chat.chatid,
				type: 'user',
				userpic: message.userpic,
				text: message.username,
				bump: new Date().toISOString()
			});

			$location.url('/mockup/' + chat.chatid);
		});
	}
}]);