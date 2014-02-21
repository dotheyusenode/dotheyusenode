'use strict';

/* Controllers */

angular.module('nodeCheck.controllers', []).
  controller('AppCtrl', function($scope, $http) {
    $scope.website = {url: ''};
    $scope.displayResult = false;
    $scope.displayError = false;
    $scope.check = function() {
      var url = $scope.website.url;
      if (url !== "") {
        $scope.reasons = [];
        $scope.makeRequest(url);
      }
    }
    $scope.makeRequest = function(url) {
      $http({method: 'GET', url: "/?url=" +encodeURIComponent(url)}).
        success(function(data, status, headers, config) {
          $scope.displayResult = true;
          $scope.displayError = false;
          $scope.resultUrl = data.message.url;
          $scope.message = data.message.answer;
          if(data.message.reasons.length > 0)
            $scope.reasons = data.message.reasons[0].reasons;
        }).
        error(function(data, status, headers, config) {
          $scope.displayError = true;
          $scope.displayResult = false;
          $scope.errorMsg = "Sorry, an error "+status+" occured";
        });
    }
  });