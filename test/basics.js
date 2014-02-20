var start = require('./start')
var request = require('request')
var should = require('should')
var host = require('./host')

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

})
