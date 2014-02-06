var request = require('request');
var expressChecker = require('./checkers/express');
var sailsChecker = require('./checkers/sails');
var koaChecker = require('./checkers/koa');
var jsSourceCheckers = require('./checkers/needsjs');
var async = require('async');
var _ = require('underscore');


function handler(url, callback) {
  var obj = {
    answer: 'Maybe, but we cannot tell',
    reasons: []
  };
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }
  request(url, function(e,r,b) {

    function runner(task, cb) {
      task(r,b,cb);
    }

    if (e) {
      return callback(e);
    } else {
      var checkers = [
        expressChecker,
        sailsChecker,
        koaChecker,
        jsSourceCheckers
      ];

      async.map(checkers, runner, function(err, reasons) {
        obj.reasons = _.filter(_.flatten(reasons), function(r) { return r && r.found; });
        if (obj.reasons.length > 0) {
          obj.answer = 'node activity detected';
        }
        callback(null, obj);
      });

    }
  });
}

module.exports = handler;
