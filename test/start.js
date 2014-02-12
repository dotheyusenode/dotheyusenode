var started = false;

module.exports = function(cb) {
  if (started) {
    cb();
  } else {
    require('../app')(function(){
      started = true
      cb()
    });
  }
}
