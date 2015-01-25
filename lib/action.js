var fs = require('fs')
  , mustache = require('mustache');

var Action = (function() {
  function Action(func) {
    this.func = func;
  };

  Action.prototype.render = function(file) {
    var self = this;
    var page, _error;

    fs.readFile('./views/layout.html', 'utf8', function (error, layout) {
      if (error) {
        self.response.writeHead(500, {'Content-Type': 'text/plain'});
        self.response.end("readFile: " + error);
      } else {
        fs.readFile(file, 'utf8', function (error, page) {
          if (error) {
            self.response.writeHead(500, {'Content-Type': 'text/plain'});
            self.response.end("readFile: " + error);
          } else {
            self.response.writeHead(200, {'Content-Type': 'text/html'});
            self.response.end(mustache.render(layout, {
              page: mustache.render(page)
            }));
          }
        });
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
