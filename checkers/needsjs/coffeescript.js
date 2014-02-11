var cfdetector = require('coffeescript-detector')
var async = require('async')
var _ = require('underscore')

function handler(obj, cb) {
  var pairs = obj.pairs
  async.map(pairs, function(p, cb) {
    cfdetector(p[1], function(err, results) {
      if (results) {
        p.push(results)
      }
      cb(err, p)
    })
  }, function(err, mapped){
    if (err) {
      return cb(err)
    }
    var positives = _.filter(mapped, function(a) { return a.length === 3 })
    var reasons = _.map(positives, function(p) {
      return p[0] + ": " + JSON.stringify( p[2].lines)
    })

    if (positives.length > 0) {
      cb(null, {
        name: 'CoffeeScript',
        found: true,
        reasons: reasons
      })
    } else {
      cb(null)
    }
  })
}

module.exports = handler
