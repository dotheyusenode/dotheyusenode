var async = require('async')

module.exports = function(req, res) {
  var client = require('redis-url').connect(require('./red'))

  function handleKeys(err, keys) {
    if (err) {
      return res.send(500)
    }

    async.map(keys, function(k, cb) {
      client.ttl(k, function(err, ttl) {
        cb(err, {url: k, ttl: ttl})
      })
    }, function(err, results) {
      if (err) {
        res.send(500)
      } else {
        res.send(results)
      }
    })
  }

  client.keys('*', handleKeys)
}
