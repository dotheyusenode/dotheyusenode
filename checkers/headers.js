var _ = require('underscore');

var frameworks = [
  {name: 'express.js', s: "express", h: 'x-powered-by'},
  {name: 'koa.js', s: 'koa', h: 'x-powered-by'},
  {name: 'sails.js', s: "sails", h: 'x-powered-by'},
  {name: 'ecstatic', s: 'ecstatic', h: 'server'},
  {name: 'flatiron', s: 'flatiron', h: 'x-powered-by'},
  {name: 'connect cookie', s: 'connect.sid', h: 'set-cookie'}
]

module.exports = function(r, body, cb) {
  var f = []
  _.each(frameworks, function(fr) {

    var h = r.headers[fr.h];
    var checker = {
      name: fr.name,
      found: false,
      reasons: []
    }
    if (fr.h === 'set-cookie') {
      if (h && h[0] && h[0].toLowerCase().indexOf(fr.s) !== -1 ) {
        checker.found = true;
        checker.reasons.push('Found ' + fr.h + ': ' + h[0] + ' in response')
      }
    } else if (h && h.toLowerCase().indexOf(fr.s) !== -1) {
      checker.found = true
      checker.reasons.push('Found ' + fr.h + ': ' + h + ' header in response')
    }
    f.push(checker)
  });
  cb(null, f);
}
