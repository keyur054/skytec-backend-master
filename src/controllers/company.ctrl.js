var system = require("./../modules");
/**
 * Company Insert
 */
router.route("/web/company/addnew").post(
    /**
     * Web registration
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    function(req, res) {
      var input = req.body;

      system.co(function*() {
        if (system.validator.validate(input, "companyAddnew", req)) {
            // yield any promise
            var findCompany = yield system.db.Company.findOne({
                company_short_name: input.company_short_name
            });
            if (findCompany) {
                //Company already exist
                res.json({
                    success: false,
                    message: "Company short name already exist."
                });
            } else {

                var newUser = new system.db.Company(input);
                var savedData = yield newUser.save();
                
                res.json({
                    success: true,
                    message: "Company Created Successfully."
                });
            }
        } else {
          res.json({ success: false, error: req.reqError });
        }
      });
    }
  );
/**
 * Company List
 */
  router.route("/web/company").get(function(req, res) {
    system.co(function*() {
      var data = yield system.db.Company.find().populate("qms").populate("payment_terms");
      res.json({
        success: true,
        company: data
      });
    });
  });

/**
 * Single Company Data for Edit
 */
router.route("/web/company/:id").get(function(req, res) {
  system.co(function*() {
    var data = yield system.db.Company
      .findById(mongoose.Types.ObjectId(req.params.id));
    res.json({
      success: true,
      company: data
    });
  });
});

router.route("/web/company/:id").post(function(req, res) {
  var input = req.body;
  system.co(function*() {
    if (system.validator.validate(input, "companyAddnew", req)) {
      var company = yield system.db.Company.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        input
      );
      if (company) {
        res.json({
          success: true,
          company: company,
          message: "Company Update Successfully"
        });
      } else {
        res.json({
          success: false,
          message: "Company not found."
        });
      }
    } else {
      res.json({ success: false, error: req.reqError });
    }
  });
});

router.route("/web/qms").get(function(req, res) {
  system.co(function*() {
    
    var data = yield system.db.qms.find();
    res.json({
      success: true,
      qms: data
    });
  });
}); 

router.route("/web/paymentterm").get(function(req, res) {
  system.co(function*() {
    
    var data = yield system.db.paymentTerms.find();
    res.json({
      success: true,
      payment_terms: data
    });
  });
});

module.exports = router;