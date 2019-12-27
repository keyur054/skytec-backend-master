/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  PaymentTermsSchema = new Schema({
    code: { type: String },
    description: { type: String },
    slug: { type: String, unique: true }
  });
PaymentTermsSchema.plugin(dataTables);
module.exports = mongoose.model("payment_terms", PaymentTermsSchema);
