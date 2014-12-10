module.exports = function ($routeProvider, $locationProvider) {
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
};