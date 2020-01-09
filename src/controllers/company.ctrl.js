var system = require("./../modules");
var fs = require('fs');

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
  function (req, res) {
    var input = req.body;

    system.co(function* () {
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

          for (var i = 0; i <= newUser.customer_supplier.length; i++) {
            //console.log(newUser.customer_supplier[i])
            var cs_name = "";
            if (newUser.customer_supplier[i] == 1) {
              cs_name = "C" + newUser.customer_supplier_no.substring(0, 3) + "_" + newUser.company_short_name;
            }
            else if (newUser.customer_supplier[i] == 2) {
              cs_name = "S" + newUser.customer_supplier_no.substring(0, 3) + "_" + newUser.company_short_name;
            }
            if (cs_name != "") {
              var jsonData = { "c_id": newUser._id, "folder_name": cs_name }
              var newFolder = new system.db.CSfolder(jsonData);
              var savedDatanew = yield newFolder.save();
            }
          }


          res.json({
            success: true,
            id: savedData._id,
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
 * Get Company List
 */
router.route("/web/company").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Company.find().populate("qms")
      .populate("payment_terms").collation({locale:'en'}).sort({'company_name': 1});
    res.json({
      success: true,
      company: data
    });
  });
});

/**
 * Single Company Data for Edit
 */
router.route("/web/company/edit/:id").get(function (req, res) {
  system.co(function* () {
    var data = yield system.db.Company
      .findById(mongoose.Types.ObjectId(req.params.id));
    res.json({
      success: true,
      company: data
    });
  });
});

router.route("/web/company/search").post(function (req, res) {
  system.co(function* () {
    var input = req.body;
    var jsondata=[];
    console.log("95line",input);
    console.log("96lonee" , jsondata);
    
    if(input.company_name != '' && input.company_name != undefined){
       //jsondata +='{ company_name: '+ "'"+input.company_name+"'" +'}';
       jsondata.push({ company_name: ''+input.company_name+''});
    }
    if(input.customer_supplier_no != '' && input.customer_supplier_no != undefined ){
      //jsondata +='{ customer_supplier_no :'+ input.customer_supplier_no +'}';
      jsondata.push({ customer_supplier_no: ''+input.customer_supplier_no+''});
    }
    if(input.surname != '' && input.surname != undefined ){
      jsondata.push({ surname: ''+input.surname+''});
    }
    if(input.city != '' && input.city != undefined){
      //jsondata +='{ city :'+ input.city +'}';
      jsondata.push({ city: ''+input.city+''});
    }
    if(input.street != '' && input.street != undefined){
      //jsondata +='{ street :'+ input.street +'}';
      jsondata.push({ street: ''+input.street+''});
    }

    console.log(jsondata);
    
    var companyList =  yield system.db.Company.aggregate([

      {
        $lookup: {
          from: "Address",       // other table name
          localField: "_id",   // name of users table field
          foreignField: "c_id", // name of userinfo table field
          as: "address"         // alias for userinfo table
        }
      },
      
      {
        $lookup: {
          from: "contacts",
          localField: "_id",
          foreignField: "c_id",
          as: "contacts"
        }
      },
      // define some conditions here 
      {
        $match: {
         // $and: [jsondata]
          $or: jsondata
        }
      }

     
    ]);
    console.log("149sfd",companyList[0]);
    
    // res.json({
    //   success: true,
    //   companies: companyList
    // });
  });
});

/**
 * Single Company Update
 */
router.route("/web/company/:id").post(function (req, res) {
  var input = req.body;
  system.co(function* () {
    if (input.isRename) {
      var existCompany = yield system.db.Company.find({ company_short_name: input.company_short_name, _id: { $ne: input._id } });

      if (!existCompany || existCompany.length <= 0) {
        if (system.validator.validate(input, "companyAddnew", req)) {
          var findCompany = yield system.db.Company.findOne({
            company_short_name: input.company_short_name
          });
          if (findCompany && input.isrename == 1) {
            //Company already exist
            res.json({
              success: false,
              message: "Company short name already exist."
            });
          } else {
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
            // } else {

            //   res.json({ success: false, error: req.reqError });
            // }
          }
        }
      }
    }
    else {
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

    }
  });
});

/**
 * Single Company Data for Edit
 */
router.route("/web/company/delete/:id").post(function (req, res) {
  system.co(function* () {

    var contacts = yield system.db.Address.findOne({ c_id: req.params.id });
    var address = yield system.db.Address.findOne({ c_id: req.params.id });

    if (contacts == null && address == null) {
      var company = yield system.db.Company.deleteOne({ _id: req.params.id });
      if (company) {
        res.json({
          success: true,
          message: "Customer / Supplier deleted successfully"
        });
      }
      else {
        res.json({
          success: false,
          message: "Failed to delete customer / supplier"
        });
      }
    }
    else {
      res.json({
        success: false,
        message: "Contact Or Address exists for this customer and supplier"
      });
    }
  });
});

/**
 * Get QMS list
 */
router.route("/web/qms").get(function (req, res) {
  system.co(function* () {

    var data = yield system.db.qms.find();
    res.json({
      success: true,
      qms: data
    });
  });
});

/**
 * Get payment term list
 */
router.route("/web/paymentterm").get(function (req, res) {
  system.co(function* () {

    var data = yield system.db.paymentTerms.find();
    res.json({
      success: true,
      payment_terms: data
    });
  });
});

/**
 * Search list
 */
// router.route("/web/company/search").post(function (req, res) {
//   system.co(function* () {

//     var input = req.body;
//     console.log(input);
//     var data = yield system.db.Company.find({
//       //company_name: input.company_name,
//       customer_supplier_no: input.customer_no
//     });
//     res.json({
//       success: true,
//       company: data
//     });
//     //console.log(req)
//     // var data = yield system.db.paymentTerms.find();
//     // res.json({
//     //   success: true,
//     //   payment_terms: data
//     // });
//   });
// });





module.exports = router;