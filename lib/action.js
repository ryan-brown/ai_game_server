var fs = require('fs')
  , mustache = require('mustache');

var Action = (function() {
  function Action(func) {
    this.func = func;
  };

  Action.prototype.render = function(file) {
    var self = this;
    fs.readFile(file, 'utf8', function (error, text) {
      if (error) {
        self.response.writeHead(500, {'Content-Type': 'text/plain'});
        self.response.end("readFile: " + error);
      } else {
        self.response.writeHead(200, {'Content-Type': 'text/html'});
        self.response.end(mustache.render(text));
      }
    });
  };

  Action.prototype.call = function(request, response) {
    this.request = request;
    this.response = response;
    this.func.bind(this)();
  };

  return Action;
})();

module.exports = Action;
