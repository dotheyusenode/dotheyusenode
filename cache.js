var src = require('src')
var red = require('./red')

var cache = src({
  url: red,
  expiry: 60 * 20, //20 minutes
  id: process.env.SRC_ID || 'dev'
})

module.exports = cache
