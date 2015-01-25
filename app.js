var http = require("http")
  , querystring = require("querystring")
  , nedb = require("nedb")
  , db = new nedb({ filename: "data.db", autoload: true });

var game = require("./ai_game_engine/engine");

var router = require("./lib/router")
  , action = require("./lib/action");

// Dev tools.
require('locus');

// App Actions
//////////////

// GET /
var home = new action(function() {
  this.render("./views/home.html");
});

// GET /rules
var rules = new action(function() {
  this.render("./views/rules.html");
});

// GET /submit
var submit = new action(function() {
  this.render("./views/submit.html");
});

// GET /games
var games = new action(function() {
  this.render("./views/games.html");
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
      if (!data.code) {
        throw new Error() ;
      }
      var dummyGame = new game();
      dummyGame.evalPlayerCode(data.code);
      db.insert({ code : data.code });
      self.response.writeHead(200, { "Content-Type" : "application/json" });
      self.response.end("{ message : \"Success.\" }");
    }
    catch(err) {
      self.response.writeHead(400, { "Content-Type" : "application/json" });
      self.response.end("{ message : " + err + " }");
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
  "GET /"       : home,
  "GET /rules"  : rules,
  "GET /submit" : submit,
  "GET /games"  : games,
  "POST /code"  : code,
  "POST /run"   : run,
});

// Server
/////////

var SERVER = "127.0.0.1", PORT = 1337;

http.createServer(function (request, response) {
  router.route(request, response);
}).listen(PORT, SERVER);

console.log("Server running at http://" + SERVER + ":" + PORT);
