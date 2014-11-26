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
	return {
		chat: $resource('/api/chat/:id/', {}, {
			get: {
				isArray: true
			}
		})
	};
}]);

app.controller('sidebar', ['$scope', '$rootScope', 'api', function ($scope, $rootScope, api) {

	$rootScope.user = {
		id: 1,
		name: 'безумный пользователь',
		userpic: 'http://i.imgur.com/9KIYE30.jpg'
	};

	$scope.tabs = api.chat.query();
}]);


app.controller('chat', ['$scope', '$rootScope', '$routeParams', '$sce', 'api', function ($scope, $rootScope, $routeParams, $sce, api) {

	$rootScope.currentChat = $routeParams.chat || 1;

	//workaround https://github.com/angular/angular.js/issues/1352
	$scope.trust = function (src) {
		return $sce.trustAsResourceUrl(src);
	};

	$scope.chat = api.chat.get({
		id: $rootScope.currentChat
	});
}]);