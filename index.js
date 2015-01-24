var http = require('http')
  , fs = require('fs')
  , querystring = require('querystring')
  , nedb = require('nedb')
  , db = new nedb({ filename: 'data.db', autoload: true })
  , mustache = require('mustache');

// Action
/////////

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

// Router
/////////

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
      return this.error.call(request, response);
    }
  };

  Router.prototype.error = new Action(function() {
    this.render("./views/404.html");
  });

  return Router;
})();

// Server
/////////

home = new Action(function() {
  this.render("./views/home.html");
});

code = new Action(function() {
  var self = this;

  if (this.request.method == "POST") {
    var body = "";
    this.request.on("data", function(chunk) {
      body = body + chunk;
    });

    this.request.on("end", function() {
      db.insert(querystring.parse(body));
      self.response.writeHead(302, { 'Location': '/db' });
      self.response.end();
    });
  } else {
    self.response.writeHead(302, { 'Location': '/db' });
    self.response.end();
  }
});

database = new Action(function() {
  var self = this;

  db.find({}, function (err, docs) {
    self.response.writeHead(200, {'Content-Type': 'text/plain'});
    self.response.end(JSON.stringify(docs));
  });
});

var router = new Router({
  "/" : home,
  "/code" : code,
  "/db" : database,
});

http.createServer(function (request, response) {
  router.route(request, response);
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
