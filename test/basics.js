var start = require('./start')
var request = require('request')
var should = require('should')
var host = require('./host')

var async = require('async')
var _ = require('underscore')

describe('do they use node?', function(){
  this.timeout(5000)
  function ops(q) {
    if (!q) {
      q = {}
    }
    q.json = true
    return q
  }

  before(function(done) {
    start(done)
  })

  function noAnswer(r,b,done) {
    r.statusCode.should.be.equal(200)
    b.should.have.property('message')
    b.message.should.have.property('answer', 'Maybe, but we cannot tell')
    b.message.should.have.property('reasons')
    b.message.reasons.should.have.property('length', 0)
    done()
  }

  it('should return json', function(done){
    request(host, ops({qs: { url: 'www.google.com' }}), function(e,r,b) {
      if (e) { throw e }
      noAnswer(r,b,done)
   })
  })

  it('should return no reasons for google.com', function(done){
    request(host, ops({qs: { url: 'www.google.com' }}),
      function(e,r,b) {
        if (e) { throw e }
        noAnswer(r,b,done)
    })
  })

  function answer(r,b,done) {
    r.statusCode.should.be.equal(200)
    b.should.have.property('message')
    b.message.should.have.property('reasons')
    var reasons = b.message.reasons
    reasons.length.should.be.equal(1)
    done()
  }

  it(
    'should return browserify reasons for substack.net',
    function(done) {
      request(host, ops({qs: { url: 'substack.net' }}),
        function(e,r,b) {
          answer(r,b,done)
        })
    }
  )

  it('should cache results making the second request super fast', function(done) {
    var target = "twitter.com"
    function mr(cb) {
      request(host, ops({qs: {url: target}}), cb)
    }
    function md(cb) {
      request.del(host, ops({qs: {url: target}}), cb)
    }
    md(function() {
      var m1 = new Date()
      mr(function() {
        m1 = new Date() - m1
        var m2 = new Date()
        mr(function() {
          m2 = new Date() - m2
          m2.should.be.below(m1 / 2)
          done()
        })
      })
    })
  })

  it('should get a list of recently hit urls with tty', function(done) {
    var urls = ['substack.net', 'wlaurance.com', 'github.com',
      'ebay.com', 'amazon.com', 'turtles.com']

    function r(u,cb) {
      request(host, ops({qs: {url: u}}), cb)
    }

    function testCache() {
      request.get(host + '/cache', ops(), function(e,r,b) {
        r.statusCode.should.be.equal(200)
        b.should.have.property('length')
        _.each(b, function(hit) {
          hit.should.have.property('url')
          hit.should.have.property('ttl')
        })
        done()
      });
    }

    async.each(urls, r, testCache)
  })

  it('should count the number of times a success url gets', function(done) {

    function makeRequest(a, cb) {
      request(host, ops({qs: {url: host}}), function(e,r,b){
        r.statusCode.should.be.equal(200)
        cb()
      })
    }

    function getCount(cb) {
      request(host + '/counts', ops({qs: {url: host}}), function(e,r,b) {
        r.statusCode.should.be.equal(200)
        cb(b.count)
      })
    }

    function makeXRequests(count, cb) {
      async.eachSeries(_.range(0, count), makeRequest, cb)
    }

    var X = 100

    getCount(function(count) {
      makeXRequests(X, function() {
        getCount(function(newCount) {
          Number(newCount).should.be.equal(Number(count) + X)
          done()
        })
      })
    })
  })

  it('should get the count for all urls with positive results', function(done) {
    request(host + '/counts', ops(), function(e,r,b) {
      r.statusCode.should.be.equal(200)
      _.each(b, function(d) {
        d.should.have.property('url')
        d.should.have.property('count')
        d.url.indexOf(require('../countPrefix')).should.be.equal(-1)
      })
      done()
    })
  })
})
