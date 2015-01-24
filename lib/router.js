var Router = (function() {
  var _routes;

  function Router(routes) {
    _routes = routes;
  };

  Router.prototype.route = function(request, response) {
    console.log(request.method + " " + request.url);

    if (_routes[request.url]) {
      return _routes[request.url].call(request, response);
    } else {
      self.response.writeHead(200, {'Content-Type': 'text/plain'});
      self.response.end(JSON.stringify(docs));
    }
  };

  // Router.prototype.error = new Action(function() {
  //   this.render("./views/404.html");
  // });

  return Router;
})();

module.exports = Router;
