/**
 * UserController
 *
 */
var system = require("./../modules");
router.route("/web/users").get(function(req, res) {
  system.co(function*() {
    var data = yield system.db.webUser.find().populate("role_ids");
    res.json({
      success: true,
      users: data
    });
  });
});

router.route("/web/roles").get(function(req, res) {
  system.co(function*() {
    var data = yield system.db.role.find();
    res.json({
      success: true,
      data: data
    });
  });
});

router.route("/web/users/get/paginated").post(function(req, res) {
  var order = req.body.order[0].column,
    dir = req.body.order[0].dir,
    col = req.body.columns[order].data,
    sortObj = {};
  sortObj[col] = dir;

  var params = {
    find: {
      user_type: "admin"
    },
    limit: req.body.length,
    skip: req.body.start,
    search: {
      value: req.body.search.value,
      fields: ["fname", "lname", "email"]
    },
    sort: sortObj
  };
  system.db.webUser.dataTables(params).then(function(table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total
    });
  });
});
/**
 * Create category
 */
router.route("/web/register").post(
  /**
   * Web registration
   * @param {type} req
   * @param {type} res
   * @returns {undefined}
   */
  function(req, res) {
    var input = req.body;
    system.co(function*() {
      if (system.validator.validate(input, "webUserRegistration", req)) {
        // yield any promise
        var findUser = yield system.db.webUser.findOne({
          username: input.username
        });
        if (findUser) {
          //user already exist
          res.json({
            success: false,
            message: "Username already exist."
          });
        } else {
          //create new user
          // var verification_code = system.middleware.helper.randomString();
          // input.verification_code = verification_code;
          input.password = input.password;
          input.password = system.bcrypt.hashSync(input.password, 10);
          var newUser = new system.db.webUser(input);
          var savedData = yield newUser.save();
          // var content = system.middleware.helper.getTemplate('/../views/emails/web.register', {
          //     user: savedData.toJSON(),
          //     link: process.env.FRONT_URL + 'activate/' + system.middleware.helper.encrypt(savedData.email) + '/' + verification_code
          // });
          // system.middleware.helper.sendEmail('User Activation', savedData.email, content);
          res.json({
            success: true,
            message: "User Created Successfully."
          });
        }
      } else {
        res.json({ success: false, error: req.reqError });
      }
    });
  }
);

router.route("/web/users/:id").get(function(req, res) {
  system.co(function*() {
    var data = yield system.db.webUser
      .findById(mongoose.Types.ObjectId(req.params.id))
      .populate("role_ids");
    res.json({
      success: true,
      user: data
    });
  });
});

/**
 * Update users
 */
router.route("/web/users/password/:id").post(function(req, res) {
  var input = req.body;
  system.co(function*() {
    var data = yield system.db.webUser.findOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });

    if (system.bcrypt.compareSync(input.oldpassword, data.password)) {
      data.password = system.bcrypt.hashSync(input.newpassword, 10);
      var savedData = yield data.save();
      res.json({
        success: true,
        user: data,
        message: "Password saved successfully"
      });
    } else {
      res.json({
        success: false,
        message: "Incorrect old password."
      });
    }
  });
});

/**
 * Update users
 */
router.route("/web/users/:id").post(function(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "webUserRegistration", req)) {
      if (input.password) {
        delete input.password;
      }
      if (input.newpassword) {
        input.password = system.bcrypt.hashSync(input.newpassword, 10);
        delete input.newpassword;
      }

      var user = yield system.db.webUser.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        input
      );
      if (user) {
        res.json({
          success: true,
          user: user,
          message: "User saved Successfully"
        });
      } else {
        res.json({
          success: false,
          message: "User not found."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
});

module.exports = router;
