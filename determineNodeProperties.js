var request = require('request');
var headers = require('./checkers/headers.js');
var jsSourceCheckers = require('./checkers/needsjs');
var async = require('async');
var _ = require('underscore');
var cache = require('./cache')
var normalizeUrl = require('./normalizeUrl')

function incrUrl(obj, url, cb) {
  if (obj.reasons.length > 0) {
    require('./redisClient').incr(require('./countPrefix') + url, cb)
  } else {
    cb()
  }
}

function handler(url, callback) {
  var obj = {
    url: url,
    answer: 'Maybe, but we cannot tell',
    reasons: []
  };

  request(url, function(e,r,b) {

    function runner(task, cb) {
      task(r,b,cb);
    }

    if (e) {
      return callback(e);
    } else {
      var checkers = [
        headers,
        jsSourceCheckers
      ];

      async.map(checkers, runner, function(err, reasons) {
        obj.reasons = _.filter(_.flatten(reasons), function(r) { return r && r.found; });
        if (obj.reasons.length > 0) {
          obj.answer = 'node activity detected';
        }
        function setCache(cb) {
          cache.set(url, JSON.stringify(obj), cb)
        }
        function iu(cb) {
          incrUrl(obj, url, cb)
        }
        async.parallel([setCache, iu], function() {
          callback(null, obj)
        })
      });

    }
  });
}

module.exports = function(url, callback) {
  url = normalizeUrl(url)
  cache.get(url, function(err, value) {
    if (value) {
      value = JSON.parse(value)
      incrUrl(value, url, function() {
        callback(null, value)
      })
    } else {
      handler(url, callback)
    }
  })
}
