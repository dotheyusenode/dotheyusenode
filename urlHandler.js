var isValid = require('./isValid');

module.exports = function(req, res) {
  var url = req.query.url;
  if (isValid(url)) {
    res.send(200, {message: url + ' is valid'});
  } else {
    res.send(400, {error: url + ' is not a valid url'});
  }
};
