/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  RoleSchema = new Schema({
    name: { type: String },
    slug: { type: String, unique: true },
    abbr: { type: String },
    role_type_ids: [
      {
        type: String,
        ref: "role_types"
      }
    ]
  });
RoleSchema.plugin(dataTables);
module.exports = mongoose.model("roles", RoleSchema);
