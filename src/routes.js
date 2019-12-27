var controller = require("./controllers");
var middleware = require("./middlewares");

app.use("/api/auth/", controller.auth);
// app.use('/content/', controller.download);
app.use("/api/", middleware.JWTAuth("on"), controller.user);
app.use("/api/", middleware.JWTAuth("on"), controller.company);
