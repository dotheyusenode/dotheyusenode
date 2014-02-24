'use strict';


// Declare app level module which depends on filters, and services
var nodeCheck = angular.module('nodeCheck', [
  'ngRoute',
  'nodeCheck.filters',
  'nodeCheck.services',
  'nodeCheck.directives',
  'nodeCheck.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/partial.html', 
      controller: 'AppCtrl'
    }).
    when('/credits', {
      templateUrl: 'partials/about.html',
      controller: 'AppCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
