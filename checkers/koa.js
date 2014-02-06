module.exports = function(res, body, cb) {
  var checker = {
    name: 'koa',
    found: false,
    reasons: []
  };
  var headers = res.headers;
  if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().indexOf('koa') !== -1) {
    checker.found = true;
    var xpb = headers['x-powered-by'];
    checker.reasons.push('Found X-Powered-By: ' + xpb + ' header in response');
  }
  cb(null, checker);
};
