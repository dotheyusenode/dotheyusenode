'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope) {
    $scope.website = {url: ''};
    $scope.check = function() {
      console.log($scope.website);
    }
  });