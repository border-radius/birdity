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

app.factory('api', ['$resource', function ($resource) {
	var onTabChange;

	return {
		chat: $resource('/api/chat/:id/', {}, {
			get: {
				isArray: true
			}
		})
	};
}]);

app.controller('sidebar', ['$scope', '$rootScope', '$routeParams', 'api', function ($scope, $rootScope, $routeParams, api) {

	$rootScope.user = {
		name: 'безумный пользователь',
		userpic: 'http://i.imgur.com/9KIYE30.jpg'
	};

	$scope.tabs = api.chat.query();
}]);


app.controller('chat', ['$scope', '$rootScope', '$routeParams', 'api', function ($scope, $rootScope, $routeParams, api) {

	$rootScope.currentChat = $routeParams.chat || 1;

	$scope.chat = api.chat.get({
		id: $rootScope.currentChat
	});
}]);