var coffeescript = require('./coffeescript.js');
var browserify = require('./browserify.js')
var cheerio = require('cheerio');
var _ = require('underscore');
var request = require('request');
var async = require('async');

function handler(r, b, cb) {
  var $ = cheerio.load(b);
  var scripts = _.filter(
    _.pluck(_.pluck($('script'), 'attribs'), 'src'),
    function(e) { return e;});
  scripts = _.map(scripts, function(script) {
    if (script.indexOf('http') === -1) {
      var uri = r.request.uri;
      return uri.protocol + '//' + uri.host + '/' + script;
    }
    return script;
  });

  function getScript(s, cb) {
    request(s, function(e,r,b) {
      cb(e,b);
    });
  }

  async.map(scripts, getScript, function(err, results) {
    function examine(pairs) {
      return function(e, cbe) {
        e({
          request: r,
          body: b,
          pairs: pairs
        }, cbe);
      };
    }
    if (err) {
      return cb(err);
    } else {
      var pairs = _.zip(scripts, results);
      var examiners = [coffeescript, browserify];
      async.map(examiners, examine(pairs), cb);
    }
  });
}

module.exports = handler;
