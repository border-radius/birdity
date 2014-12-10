require('angular');
require('angular-resource');
require('angular-route');

var app = angular.module('birdity', ['ngResource', 'ngRoute']);

app.config([
  '$routeProvider',
  '$locationProvider',
  require('./router')
]);

app.directive('quotes', require('./directives/quotes'));

app.directive('magic', [
  '$timeout',
  '$rootScope',
  'Chats',
  require('./directives/magic')
]);

app.factory('Chats', [
  '$resource',
  require('./factories/chats')
]);

app.factory('Users', [
  '$resource',
  require('./factories/users')
]);

app.controller('sidebar', [
  '$scope',
  '$rootScope',
  'Chats',
  '$location',
  '$timeout',
  require('./controllers/sidebar')
]);

app.controller('chat', [
  '$scope',
  '$rootScope',
  '$routeParams',
  '$sce',
  '$location',
  'Chats',
  require('./controllers/chat')
]);

app.controller('write', [
  '$scope',
  require('./controllers/write')
]);