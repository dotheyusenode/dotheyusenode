module.exports = function(req, res) {
  var url = req.query.url;
  console.log(url);
  res.send(200, {url: url});
};
