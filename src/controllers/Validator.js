/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Validator = require("jsonschema").Validator;
var schemas = {};
var validatorObj = {};

schemas.webUserRegistration = {
  id: "/webUserRegistration",
  type: "object",
  properties: {
    fname: { type: "string" },
    lname: { type: "string" },
    username: { type: "string" },
    password: { type: "string" }
  },
  required: ["username", "fname", "password"]
};

schemas.webForgotPassword = {
  id: "/webForgotPassword",
  type: "object",
  properties: {
    email: { type: "string" }
  },
  required: ["email"]
};
schemas.activateWebUser = {
  id: "/activateWebUser",
  type: "object",
  properties: {
    code1: { type: "string" },
    code2: { type: "string" },
    password: { type: "string" }
  },
  required: ["code1", "code2", "password"]
};
schemas.updateUserProfile = {
  id: "/updateUserProfile",
  type: "object",
  properties: {
    fname: { type: "string" },
    lname: { type: "string" },
    facebookid: { type: "string" }
  },
  required: ["fname", "facebookid"]
};
schemas.normalLogin = {
  id: "/normalLogin",
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    device_token: { type: "string" }
  },
  required: ["email", "password", "device_token"]
};
schemas.webLogin = {
  id: "/webLogin",
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" }
  },
  required: ["username", "password"]
};
schemas.companyAddnew = {
  id: "/companyAddnew",
  type: "object",
  properties: {
    company_name: { type: "string" },
    customer_supplier_no: { type: "string" }
  },
  required: ["company_name", "customer_supplier_no"]
};

schemas.contactAddnew = {
  id: "/contactAddnew",
  type: "object",
  properties: {
    title: { type: "string" }
  },
  required: ["title"]
};

schemas.addressAddnew = {
  id: "/addressAddnew",
  type: "object",
  properties: {
    city: { type: "string" }
  },
  required: ["city"]
};



validatorObj.isValid = false;
validatorObj.errors = [];
validatorObj.validate = function(inputs, obj, req) {
  var v = new Validator();
  var doValidation = v.validate(inputs, schemas[obj]);
  if (!doValidation.errors.length) {
    req.isValid = validatorObj.isValid = true;
    req.reqError = validatorObj.errors = [];
    return true;
  } else {
    req.isValid = validatorObj.isValid = false;
    req.reqError = validatorObj.errors = doValidation.errors;
    return false;
  }
};
module.exports = validatorObj;
