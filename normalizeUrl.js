module.exports = function(url) {
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }
  return url;
}
