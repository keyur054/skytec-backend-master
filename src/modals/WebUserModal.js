/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  WebUserSchema = new Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    date_of_birth: { type: Date },
    phone: { type: String },
    address: { type: String },
    user_type: { type: String },
    functions: { type: String },
    active: { type: Boolean },
    role_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles"
      }
    ],
    verification_code: { type: String },
    forgot_code: { type: String },
    password: { type: String },
  });
WebUserSchema.plugin(dataTables);
module.exports = mongoose.model("web_users", WebUserSchema);
