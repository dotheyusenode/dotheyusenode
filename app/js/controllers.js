'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope) {
    $scope.website = {url: ''};
    $scope.check = function() {
      var url = $scope.website.url;
      if (url !== "") {
        $scope.makeRequest(url, $scope.handleRequest);
      }
    }
    $scope.handleRequest = function(code, body) {
      writeTitle();

      if (code === 200) {
        writeMessage(body.message);
      } else {
        writeError(body.error);
      }
    }
    $scope.makeRequest = function(url, cb) {
      console.log(url);
      var http = new XMLHttpRequest();
      console.log(encodeURIComponent(url))
      http.open("GET", "/?url=" + encodeURIComponent(url), true);
      http.onreadystatechange = function() {
        if (http.readyState == 4) {
          console.log(http.responseText)
          cb(http.status, JSON.parse(http.responseText));
        }
      };
      http.send(null);
    }
  });