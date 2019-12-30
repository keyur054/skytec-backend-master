/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  CSfolderSchema = new Schema({
    folder_name: { type: String},
    c_id: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "company"
        }
    ]
  });
CSfolderSchema.plugin(dataTables);
module.exports = mongoose.model("csfolder", CSfolderSchema);