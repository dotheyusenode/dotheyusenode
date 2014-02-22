var async = require('async')
var client = require('./redisClient')
var countPrefix = require('./countPrefix')

module.exports = function(req, res) {

  function getOne(url) {
    client.get(countPrefix + url, function(err, value) {
      res.send({count: value || 0})
    })
  }

  function getAll() {
    function inflate(key, cb) {
      client.get(key, function(err, value) {
        cb(err, { url: key, count: value })
      })
    }

    function keyInterator(err, keys) {
      if (err) {
        res.send(500)
      } else {
        async.map(keys, inflate, function(err, results) {
          res.send(results)
        })
      }
    }

    client.keys(countPrefix + '*', keyInterator)
  }

  if (req.query.url) {
    getOne(req.query.url)
  } else {
    getAll()
  }
}
