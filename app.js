var http = require("http")
  , querystring = require("querystring")
  , nedb = require("nedb")
  , db = new nedb({ filename: "data.db", autoload: true });

var game = require("./ai_game_engine/engine");

var router = require("./lib/router")
  , action = require("./lib/action")

// Dev tools.
require('locus');

// App Actions
//////////////

// GET /
home = new action(function() {
  this.render("./views/home.html");
});

// POST /code
code = new action(function() {
  var self = this;

  var body = "";
  this.request.on("data", function(chunk) {
    body += chunk;
  });

  this.request.on("end", function() {
    var data = querystring.parse(body);

    try {
      eval(data.code);
      db.insert({ username : data.player, code : data.code });
      // Redirect to /db route.
      self.response.writeHead(302, { "Location": "/db" });
      self.response.end();
    }
    catch(err) {
      console.log(err);
      // Redirect to / route.
      self.response.writeHead(302, { "Location": "/" });
      self.response.end();
    }
  });
});

// GET /run
run = new action(function() {
  // Play around in the terminal.
  eval(locus);
});

// GET /db
database = new action(function() {
  var self = this;

  db.find({}, function (err, docs) {
    self.response.writeHead(200, {"Content-Type": "text/plain"});
    self.response.end(JSON.stringify(docs));
  });
});

// Routes.
var router = new router({
  "GET /"      : home,
  "POST /code" : code,
  "GET /run"   : run,
  "GET /db"    : database,
});

// Server
/////////

var SERVER = "127.0.0.1", PORT = 1337;

http.createServer(function (request, response) {
  router.route(request, response);
}).listen(PORT, SERVER);

console.log("Server running at http://" + SERVER + ":" + PORT);
