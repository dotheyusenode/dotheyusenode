'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $http) {
    $scope.website = {url: ''};
    $scope.check = function() {
      var url = $scope.website.url;
      if (url !== "") {
        $scope.makeRequest(url);
      }
    }
    $scope.makeRequest = function(url) {
      $http({method: 'GET', url: "/?url=" +encodeURIComponent(url)}).
        success(function(data, status, headers, config) {
          console.log(status);
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });
    }
  });