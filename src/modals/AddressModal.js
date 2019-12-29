/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  AddressSchema = new Schema({
    c_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      }
  ],
    street: { type: String },
    number: { type: String},
    zipcode: { type: String},
    city: { type: String , required: true },
    country: { type: String },
    active: { type: Boolean }
});
AddressSchema.plugin(dataTables);
module.exports = mongoose.model("address", AddressSchema);