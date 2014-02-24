var async = require('async')
var client = require('./redisClient')
var cache = require('./cache')

module.exports = function(req, res) {

  function handleKeys(err, keys) {
    if (err) {
      return res.send(500)
    }

    async.map(keys, function(k, cb) {

      function keyNodePositive(cb) {
        client.get(k, function(err, results) {
          if (results && JSON.parse(results).reasons.length > 0) {
            cb(err, true)
          } else {
            cb(err, false)
          }
        })
      }

      function ttl(cb) {
        client.ttl(k, cb)
      }

      async.series({
        ttl: ttl,
        nodeDetected: keyNodePositive
      }, function(err, results) {
        results.url = k.replace(cache.id() + ':', '')
        cb(err, results)
      })

    }, function(err, results) {
      if (err) {
        res.send(500)
      } else {
        res.send(results)
      }
    })
  }

  cache.keys(handleKeys, { raw : true })
}
