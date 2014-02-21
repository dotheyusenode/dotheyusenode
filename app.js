
/**
 * Module dependencies.
 */

var express = require('express')
var http = require('http')
var path = require('path')

var app = express()

var done

//require our handler
var urlHandler = require('./urlHandler')
var cacheHandler = require('./cacheHandler')

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.compress())
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(require('connect-assets')({
  helperContext: app.locals
}))
app.use(app.router)
app.use(express.static(path.join(__dirname, 'app')))

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler())
}

app.get('/', function index(req, res) {
  if (req.query.url) {
    return urlHandler(req,res)
  } else {
    res.render('index')
  }
})

app.delete('/', function(req,res) {
  if (req.query.url) {
    require('./cache').del(
      require('./normalizeUrl')(req.query.url),
      function() {
        res.send(200)
      }
    )
  } else {
    res.send(404)
  }
})

app.get('/cache', cacheHandler)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
  if (typeof done === 'function') {
    done()
  }
})

module.exports = function(cb) {
  done = cb
}
