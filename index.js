var http = require('http');

// Action
/////////

var Action = (function() {
  function Action(func) {
    this.func = func;
  };

  Action.prototype.render = function(text) {
    this.response.writeHead(200, {'Content-Type': 'text/plain'});
    this.response.end(text);
  };

  Action.prototype.call = function(request, response) {
    this.request = request;
    this.response = response;
    this.func.bind(this)();
  };

  return Action;
})();

// Router
/////////

var Router = (function() {
  var _routes;

  function Router(routes) {
    _routes = routes;
  };

  Router.prototype.route = function(request, response) {
    if (_routes[request.url]) {
      return _routes[request.url].call(request, response);
    } else {
      return this.error.call(request, response);
    }
  };

  Router.prototype.error = new Action(function() {
    this.render("Routing error.\n");
  });

  return Router;
})();

// Server
/////////

home = new Action(function() {
  this.render("Home page.\n");
});

rules = new Action(function() {
  this.render("Rules page.\n");
});

var router = new Router({
  "/" : home,
  "/rules" : rules,
});

http.createServer(function (request, response) {
  router.route(request, response);
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
