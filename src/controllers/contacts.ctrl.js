var system = require("./../modules");

router.route("/web/contact/addnew").post(
    /**
     * Web registration
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    function(req, res) {
      var input = req.body;

      system.co(function*() {
        if (system.validator.validate(input, "contactAddnew", req)) {
            // yield any promise
            var newContact = new system.db.Contacts(input);
            var savedData = yield newContact.save();
            
            res.json({
                success: true,
                message: "Contact Created Successfully."
            });
            
        } else {
          res.json({ success: false, error: req.reqError });
        }
      });
    }
  );


 /**
 * Get Contacts List
 */
router.route("/web/contacts/:id").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Contacts.find({ c_id: req.params.id } );;
    res.json({
      success: true,
      contacts: data
    });
  });
});
 
/**
 * Get Sex List
 */
router.route("/web/sex").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.sex.find();
    res.json({
      success: true,
      sex: data
    });
  });
});
 
/**
 * Single Contact Data for Edit
 */
router.route("/web/contact/:id").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Contacts
      .findById(mongoose.Types.ObjectId(req.params.id));
    res.json({
      success: true,
      company: data
    });
  });
});
/**
 * Single Contact Update
 */
router.route("/web/contact/:id").post(function (req, res) {
  var input = req.body;
  system.co(function* () {
    if (system.validator.validate(input, "contactAddnew", req)) {
      var company = yield system.db.Contacts.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        input
      );
      if (company) {
        res.json({
          success: true,
          company: company,
          message: "Contact Update Successfully"
        });
      } else {
        res.json({
          success: false,
          message: "Contact not found."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
});

  module.exports = router;