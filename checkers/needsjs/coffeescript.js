var cfdetector = require('coffeescript-detector');
var async = require('async');
var _ = require('underscore');

function handler(obj, cb) {
  var body = obj.body;
  var request = obj.request;
  var pairs = obj.pairs;
  async.map(pairs, function(p, cb) {
    cfdetector(p[1], function(err, results) {
      if (results) {
        p.push(results);
      }
      cb(err, p);
    });
  }, function(err, mapped){
    if (err) return cb(err);
    var reasons = _.filter(mapped, function(a) { return a.length === 3; });
    if (reasons.length > 0) {
      cb(null, {
        name: 'CoffeeScript',
        found: true,
        reasons: reasons
      });
    } else {
      cb(null);
    }
  });
}

module.exports = handler;
