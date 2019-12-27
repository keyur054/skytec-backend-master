/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  QMSSchema = new Schema({
    id: { type: String },
    value: { type: String },
    slug: { type: String, unique: true }
  });
QMSSchema.plugin(dataTables);
module.exports = mongoose.model("qms", QMSSchema);
