var system = require("./../modules");

router.route("/web/address/addnew").post(
  /**
   * Web registration
   * @param {type} req
   * @param {type} res
   * @returns {undefined}
   */
  function (req, res) {
    var input = req.body;

    system.co(function* () {
      if (system.validator.validate(input, "addressAddnew", req)) {
        // yield any promise
        var newAddress = new system.db.Address(input);
        var savedData = yield newAddress.save();

        res.json({
          success: true,
          message: "Address Created Successfully."
        });

      } else {
        res.json({ success: false, error: req.reqError });
      }
    });
  }
);

/**
* Get Address List
*/
router.route("/web/address/:id").get(function (req, res) {
  system.co(function* () {
    //var data = yield system.db.Address.find();
    var data = yield system.db.Address.find({ c_id: req.params.id });;
    res.json({
      success: true,
      address: data
    });
  });
});

/**
 * Single Address Update
 */
router.route("/web/address/:id").post(function (req, res) {
  var input = req.body;
  system.co(function* () {
    if (system.validator.validate(input, "addressAddnew", req)) {
      var company = yield system.db.Address.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        input
      );
      if (company) {
        res.json({
          success: true,
          company: company,
          message: "Address Update Successfully"
        });
      } else {
        res.json({
          success: false,
          message: "Address not found."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
});

router.route("/web/address/delete/:id").post(function (req, res) {
  system.co(function* () {
    var address = yield system.db.Address.findById(mongoose.Types.ObjectId(req.params.id));

    if (address != null) {
      var company = yield system.db.Company.findById({ _id: address.c_id[0] });
      var contacts = yield system.db.Contacts.findById({ c_id: address.c_id[0] });

      if (company == null && contacts == null) {
        var address = yield system.db.Address.deleteOne({ _id: req.params.id });
        if (address) {
          res.json({
            success: true,
            message: "Address deleted successfully"
          });
        }
        else {
          res.json({
            success: false,
            message: "Failed to delete Address"
          });
        }
      }
      else {
        res.json({
          success: false,
          message: "Contact Or Customer exists for this customer and supplier"
        });
      }
    }
  });
});

module.exports = router;