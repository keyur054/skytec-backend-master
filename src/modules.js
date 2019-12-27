module.exports = {
  db: require("./modals"),
  validator: require("./controllers/Validator"),
  bcrypt: require("bcrypt"),
  jwt: require("jsonwebtoken"),
  _: require("lodash"),
  co: require("co"),
  middleware: require("./middlewares"),
  path: require("path"),
  mime: require("mime"),
  fs: require("fs"),
  moment: require("moment"),
  MT: require("moment-timezone")
};
