/**
 * UserController
 *
 */
var system = require("./../modules");
var migrationJSON = require("../modals/MasterDataJSON");
var Q = require("q");
router.route("/web/validate/code").post(validateWebUserCode);
router.route("/web/validate/forgot/code").post(validateWebForgotCode);
router.route("/web/reset").post(resetWebPassword);
router.route("/web/activate").post(activateWebUser);
router.route("/web/user/forgot").post(webForgotPassword);
router.route("/web/login").post(webLogin);

router.route("/migrate").post(migration);

function migrateModule(modal) {
  var deferred = Q.defer();
  system.co(function*() {
    var promises = [];
    system._.each(migrationJSON[modal], function(eachData) {
      console.log("eachData", modal, eachData);
      promises.push(
        system.db[modal].findOneAndUpdate({ slug: eachData.slug }, eachData, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        })
      );
    });
    yield promises;
    deferred.resolve();
  });

  return deferred.promise;
}

function migration(req, res) {
  system.co(function*() {
    var promises = [];
    system._.each(migrationJSON.modalList, function(modal) {
      console.log("modal", modal);
      promises.push(migrateModule(modal));
    });
    yield promises;

    res.json({
      success: true
    });
  });
}
function validateWebUserCode(req, res) {
  var input = req.body;
  system.co(function*() {
    try {
      input.email = system.middleware.helper.decrypt(input.code1);
      var findUser = yield system.db.webUser.findOne({ email: input.email });
      if (findUser) {
        if (!findUser.verification_code) {
          res.json({
            success: false,
            message: "User already activated. Please login to continue."
          });
        } else if (findUser.verification_code === input.code2) {
          res.json({
            success: true,
            user: {
              fname: findUser.fname,
              email: findUser.email
            },
            message: "Valid Request."
          });
        } else {
          res.json({
            success: false,
            message: "Invalid Request."
          });
        }
      } else {
        res.json({
          success: false,
          message: "Invalid Request."
        });
      }
    } catch (e) {
      res.json({
        success: false,
        message: "Invalid Request."
      });
    }
  });
}

function validateWebForgotCode(req, res) {
  var input = req.body;
  system.co(function*() {
    try {
      input.email = system.middleware.helper.decrypt(input.code1);
      var findUser = yield system.db.webUser.findOne({ email: input.email });
      if (findUser) {
        if (!findUser.forgot_code) {
          res.json({
            success: false,
            message: "Link already used. Please login to continue."
          });
        } else if (findUser.forgot_code === input.code2) {
          res.json({
            success: true,
            user: {
              fname: findUser.fname,
              email: findUser.email
            },
            message: "Valid Request."
          });
        } else {
          res.json({
            success: false,
            message: "Invalid Request."
          });
        }
      } else {
        res.json({
          success: false,
          message: "Invalid Request."
        });
      }
    } catch (e) {
      res.json({
        success: false,
        message: "Invalid Request."
      });
    }
  });
}

function webForgotPassword(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "webForgotPassword", req)) {
      var findUser = yield system.db.webUser.findOne({ email: input.email });
      if (findUser) {
        //create new user
        if (!findUser.forgot_code) {
          var verification_code = system.middleware.helper.randomString();
          findUser.forgot_code = verification_code;
          var savedData = yield findUser.save();
        }
        var content = system.middleware.helper.getTemplate(
          "/../views/emails/web.forgot-password",
          {
            user: findUser.toJSON(),
            link:
              process.env.FRONT_URL +
              "reset/" +
              system.middleware.helper.encrypt(findUser.email) +
              "/" +
              findUser.forgot_code
          }
        );
        system.middleware.helper.sendEmail(
          "Reset Password",
          findUser.email,
          content
        );
        res.json({
          success: true,
          message: "Reset password email sent to your registerd email address."
        });
      }
      res.json({
        success: false,
        message: "Email does not exist."
      });
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
}

function resetWebPassword(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "activateWebUser", req)) {
      // yield any promise
      input.email = system.middleware.helper.decrypt(input.code1);
      var findUser = yield system.db.webUser.findOne({ email: input.email });
      if (findUser) {
        if (!findUser.forgot_code) {
          res.json({
            success: false,
            message: "Link already used"
          });
          res.end();
        }
        if (findUser.forgot_code === input.code2) {
          findUser.password = system.bcrypt.hashSync(input.password, 10);
          findUser.forgot_code = undefined;
          var savedData = yield findUser.save();
          var token = system.jwt.sign(
            savedData.toJSON(),
            process.env.JWT_SECRET_KEY
          );
          res.json({
            success: true,
            token: token,
            user: savedData,
            message: "Password reset successfully."
          });
        } else {
          res.json({
            success: false,
            message: "Invalid Code."
          });
          res.end();
        }
      } else {
        res.json({
          success: false,
          message: "Invalid Code."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
}

function activateWebUser(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "activateWebUser", req)) {
      // yield any promise
      input.email = system.middleware.helper.decrypt(input.code1);
      var findUser = yield system.db.webUser.findOne({ email: input.email });
      if (findUser) {
        if (!findUser.verification_code) {
          res.json({
            success: false,
            message: "User already activated"
          });
          res.end();
        }
        if (findUser.verification_code === input.code2) {
          findUser.password = system.bcrypt.hashSync(input.password, 10);
          findUser.verification_code = undefined;
          var savedData = yield findUser.save();
          var token = system.jwt.sign(
            savedData.toJSON(),
            process.env.JWT_SECRET_KEY
          );
          res.json({
            success: true,
            token: token,
            user: savedData,
            message: "User activated."
          });
        } else {
          res.json({
            success: false,
            message: "Invalid Code."
          });
          res.end();
        }
      } else {
        res.json({
          success: false,
          message: "Invalid Code."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
}

function webLogin(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "webLogin", req)) {
      var data = yield system.db.webUser.findOne({ username: input.username });
      if (data) {
        if (!data.password) {
          res.json({
            success: false,
            message: "User is not activated yet."
          });
        } else {
          if (system.bcrypt.compareSync(input.password, data.password)) {
            if (!data.verification_code) {
              var token = system.jwt.sign(
                data.toJSON(),
                process.env.JWT_SECRET_KEY
              );
              res.json({
                success: true,
                token: token,
                user: data
              });
            } else {
              res.json({
                success: false,
                message: "User is not activated yet."
              });
            }
          } else {
            res.json({
              success: false,
              message: "Invalid Password."
            });
          }
        }
      } else {
        res.json({
          success: false,
          message: "Invalid username or password."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
}

module.exports = router;
