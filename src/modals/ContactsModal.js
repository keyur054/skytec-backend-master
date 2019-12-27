/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  dataTables = require("mongoose-datatables"),
  ContactsSchema = new Schema({
    title: { type: String, required: true },
    first_name: { type: String},
    surname: { type: String},
    sex: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sex"
        }
    ],
    department: { type: String },
    function: { type: String },
    telephone: { type: String },
    mobile: { type: String },
    email: { type: String },
    fax: { type: String },
    url: { type: String },
    remarks: { type: String },
    active: { type: Boolean },
    c_id: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "company"
        }
    ],
});
ContactsSchema.plugin(dataTables);
module.exports = mongoose.model("contacts", ContactsSchema);