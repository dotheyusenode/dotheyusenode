var src = require('src')

var cache = src({
  url: process.env.REDISTOGO_URL,
  expiry: 60 * 20 //20 minutes
})

module.exports = cache
