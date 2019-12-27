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
      var data = yield system.db.Company.find();
      res.json({
        success: true,
        data: data
      });
    });
  });

/**
 * Company update 
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

 

module.exports = router;