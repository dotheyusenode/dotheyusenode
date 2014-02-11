var _ = require('underscore');

var frameworks = [
  {name: 'express.js', s: "express"},
  {name: 'koa.js', s: 'koa'},
  {name: 'sails.js', s: "sails"}
]

module.exports = function(r, body, cb) {
  var xPow = r.headers['x-powered-by']; 
  var f = []
  _.each(frameworks, function(fr) {
    var checker = {
      name: fr.name,
      found: false,
      reasons: []
    }
    if (xPow && xPow.toLowerCase().indexOf(fr.s) !== -1) {
      checker.found = true
      checker.reasons.push('Found X-Powered-By: ' + xPow + ' header in response')
    }
    f.push(checker)
  });
  cb(null, f);
}
