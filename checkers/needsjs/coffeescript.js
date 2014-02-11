var cfdetector = require('coffeescript-detector');
var async = require('async');

function handler(obj, cb) {
  var body = obj.body;
  var request = obj.request;
  var pairs = obj.pairs;
  async.map(pairs, function(p, cb) {
    cfdetector(p[0], function(err, results) {
      p.push(results);
      cb(err, p);
    });
  }, function(err, mapped){
    if (err) return cb(err);
  });
}

module.exports = handler;
