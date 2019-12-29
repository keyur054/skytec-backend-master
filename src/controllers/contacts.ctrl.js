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
router.route("/web/contacts").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Contacts.find();
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
 

  module.exports = router;