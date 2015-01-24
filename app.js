var http = require("http")
  , querystring = require("querystring")
  , nedb = require("nedb")
  , db = new nedb({ filename: "data.db", autoload: true });

var router = require("./lib/router")
  , action = require("./lib/action")

// App Actions
//////////////

// GET /
home = new action(function() {
  this.render("./views/home.html");
});

// POST /code
code = new action(function() {
  var self = this;

  if (this.request.method == "POST") {
    var body = "";
    this.request.on("data", function(chunk) {
      body = body + chunk;
    });

    this.request.on("end", function() {
      db.insert(querystring.parse(body));
      self.response.writeHead(302, { "Location": "/db" });
      self.response.end();
    });
  } else {
    self.response.writeHead(302, { "Location": "/db" });
    self.response.end();
  }
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
  "/"     : home,
  "/code" : code,
  "/db"   : database,
});

// Server
/////////

var SERVER = "127.0.0.1", PORT = 1337;

http.createServer(function (request, response) {
  router.route(request, response);
}).listen(PORT, SERVER);

console.log("Server running at http://" + SERVER + ":" + PORT);
