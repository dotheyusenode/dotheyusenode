var start = require('./start')
var request = require('request')
var should = require('should')

describe('do they use node?', function(){
  var host = 'http://localhost:3000';
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

  it('should return json', function(done){
    request.post(host, ops({qs: { url: 'www.google.com' }}), function(e,r,b) {
      if (e) { throw e }
      r.statusCode.should.be.equal(200)
      b.should.have.property('message')
      b.message.should.have.property('answer', 'Maybe, but we cannot tell')
      b.message.should.have.property('reasons')
      b.message.reasons.should.have.property('length', 0)
      done()
    })
  })

  it('should return no reasons for google.com')

  it('should return browserify reasons for substack.net')

})