var isValid = require('./isValid');
var determineNodeProperties = require('./determineNodeProperties');

module.exports = function(req, res) {
  var url = req.query.url;
  if (isValid(url)) {
    determineNodeProperties(url, function(err, result) {
      if (err) {
        res.send(400, {error: 'An error has occurred for ' + url});
      } else {
        res.send(200, {message: result});
      }
    });
  } else {
    res.send(400, {error: url + ' is not a valid url'});
  }
};
