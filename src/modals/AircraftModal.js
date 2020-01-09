/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  AircraftSchema = new Schema({
    aircraft_no: { type: String},
    date: { type: String },
    type_certificate_holder: { type: String},
    model: { type: String},
    applicable_type_certificate: { type: String},
    revision: { type: String},
    certifying_authority: { type: String},
    easa_type: { type: String},
    appl_certification: { type: String},
    applicable_amendment: { type: String},
    foreign_approval_reference: { type: String},
    pdf: { type: String},
    status: { type: String},
    active: { type: Boolean }
  });
AircraftSchema.plugin(dataTables);
module.exports = mongoose.model("aircraft", AircraftSchema);