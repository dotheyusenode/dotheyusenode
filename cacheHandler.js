var async = require('async')
var client = require('redis-url').connect(require('./red'))

module.exports = function(req, res) {

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
