var system = require("./../modules");

router.route("/web/address/addnew").post(
    /**
     * Web registration
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    function(req, res) {
      var input = req.body;

      system.co(function*() {
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
router.route("/web/address").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Address.find();
    res.json({
      success: true,
      address: data
    });
  });
});
 
module.exports = router;