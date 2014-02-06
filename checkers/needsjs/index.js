var coffeescript = require('./coffeescript.js');
var cheerio = require('cheerio');
var _ = require('underscore');
var request = require('request');
var async = require('async');

function handler(r, b, cb) {
  var $ = cheerio.load(b);  
  var scripts = _.filter(
    _.pluck(_.pluck($('script'), 'attribs'), 'src'),
    function(e) { return e;});
  async.map(scripts, request, function(err, results) {
    function examine(e, cbe) {
      cbe(null);
    }
    if (err) {
      return cb(err);
    } else {
      var pairs = _.zip(scripts, results);
      var examiners = [coffeescript];
      async.map(examiners, examine, cb);
    }
  });
}

module.exports = handler;
