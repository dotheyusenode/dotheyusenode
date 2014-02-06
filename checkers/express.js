module.exports = function(res, body, cb) {
  var checker = {
    name: 'express.js',
    found: false,
    reasons: []
  };
  var headers = res.headers;
  if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase() === 'express') {
    checker.found = true;
    checker.reasons.push('Found X-Powered-By: Express header is response');
  }
  cb(null, checker);
};
