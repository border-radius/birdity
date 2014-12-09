require('angular');
require('angular-resource');
require('angular-route');

var token = 1;

var stringForms = require('../../lib/stringforms');
var _ = require('lodash');

var app = angular.module('birdity', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'chat',
		controller: 'chat'
	}).when('/:chat', {
		templateUrl: 'chat',
		controller: 'chat'
	}).otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
}]);

app.directive('quotes', function () {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.quotes, function (quotes) {
			if (quotes) {
				elem.text(stringForms(quotes, ['цитата', 'цитаты', 'цитат']));
			} else {
				elem.text('');
			}
		});
	}
});

app.directive('magic', ['$timeout', '$rootScope', 'Chats', function ($timeout, $rootScope, Chats) {
	return function (scope, elem, attrs) {

		//send
		elem.on('keydown', function (event) {
			if (event.keyCode == 13) {
				$timeout(function () {
					Chats.save({
						id: $rootScope.currentChat
					}, {
						text: elem.val()
					});
					elem.val('');
				});
			}
		});

		//prevent multilines
		elem.on('paste', function () {
			$timeout(function () {
				elem.val(elem.val().replace(/\n/g, ' '));
			});
		});

		//autoresize
		var line;
		elem.on('change cut paste drop keydown', function () {
			if (!line) line = elem[0].style.height;
			$timeout(function () {
				elem[0].style.height = line;
				elem[0].style.height = elem[0].scrollHeight+'px';
			});
		});
	};
}]);

app.factory('Chats', ['$resource', function ($resource) {
	return $resource('/api/chat/:id/', {
		token: token
	});
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
}]);


app.controller('chat', ['$scope', '$rootScope', '$routeParams', '$sce', '$location', 'Chats',
	function ($scope, $rootScope, $routeParams, $sce, $location, Chats) {

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
}]);

app.controller('write', ['$scope', function ($scope) {

}]);