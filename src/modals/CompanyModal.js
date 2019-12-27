/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  CompanySchema = new Schema({
    company_name: { type: String, required: true },
    customer_supplier_no: { type: String },
    company_short_name: { type: String, unique: true },
    is_customer: { type: Boolean },
    is_supplier: { type: Boolean },
    qms: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "qms"
      }
    ],
    vat_number: { type: String},
    gta: { type: String },
    payment_terms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment_terms"
      }
    ],
    active: { type: Boolean }
  });
CompanySchema.plugin(dataTables);
module.exports = mongoose.model("company", CompanySchema);