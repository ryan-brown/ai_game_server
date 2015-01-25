var Router = (function() {
  var _routes;

  function Router(routes) {
    _routes = routes;
  };

  Router.prototype.route = function(request, response) {
    console.log(request.method + " " + request.url);

    var route = request.method + " " + request.url;
    if (_routes[route]) {
      return _routes[route].call(request, response);
    } else {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end("Unknown route for " + route);
    }
  };

  return Router;
})();

module.exports = Router;
