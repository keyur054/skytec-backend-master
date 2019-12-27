/*MAIN APPLICATION FILE
 * nodemon app.js environment -e=local
 * pm2 start app.js environment -e=live --name="skytec"
 * pm2 start skytec-backend.sh --name="skytec" --max-memory-restart 200M
 * */
var argv = require("yargs")
  .command("environment", function(yargs) {
    yargs.options({
      location: {
        demand: true,
        alias: "e",
        type: "string"
      }
    });
  })
  .help("help").argv;
serverEnv = argv.e;
var fs = require("fs");
require("dotenv").config({ path: ".env.local"});
var port = process.env.PORT || 3000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

global.express = require("express");

/*DISPLAY LOG*/
global.logger = require("morgan");
/*ROUTING*/
global.router = express.Router();
global.bodyParser = require("body-parser");
app = express();
global.http = require("http");
global.https = require("https");
global.cors = require("cors");
const fileUpload = require("express-fileupload");

/**
 * Mongodb Connection
 */
global.mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

mongoose.connect(process.env.DB_CONNECT_STRING, {
  useNewUrlParser: true
});

global.Schema = mongoose.Schema;
/*DISPLAY LOG*/
app.use(logger("dev"));

app.use(bodyParser.json());
app.options(cors({ origin: "*" }));
app.use(cors({ origin: "*" }));

app.use(function(req, res, next) {
  // console.log("================  " + Date() + " =============== ");
  res.header("Access-Control-Expose-Headers", "x-access-token");
  res.header("Access-Control-Allow-Origin", "*");

  next();
});

/*Handle bad json*/
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON");
    res.json({
      status: -1,
      message: "Bad JSON"
    });
  }
});
app.use(fileUpload({ parseNested: true }));
var httpServer = http.createServer(app);
var httpsServer = null;
if (process.env.SSL_ENABLE == "true") {
  const serverOptions = {
    key: fs.readFileSync(process.env.HSKEY, "utf8"),
    cert: fs.readFileSync(process.env.HSCERT, "utf8"),
    ca: [fs.readFileSync(process.env.HSCHAIN, "utf8")]
  };
  httpsServer = https.createServer(serverOptions, app);
  global.io = require("socket.io").listen(httpsServer, {
    log: false,
    origins: "*:*"
  });
} else {
  global.io = require("socket.io").listen(httpServer, {
    log: false,
    origins: "*:*"
  });
}

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});
// app.use(express.static("frontend/release"));
// app.get("/", function(request, response) {
//   response.sendFile(__dirname + "/frontend/release/index.html");
// });

mongoose.plugin(require("./src/modals/lastMod.plugin"));
require("./src/routes");

if (process.env.SSL_ENABLE == "false") {
  httpServer.listen(port, function() {
    console.log("listening on +:  " + port);
  });
} else {
  httpsServer.listen(port, function() {
    console.log("listening - SSL on +:  " + port);
  });
}

module.exports = app;
