const { body, param } = require("express-validator");

const validateHeaderContact = [
  body("phone1").optional().isString().withMessage("Phone1 must be a string"),
  body("phone2").optional().isString().withMessage("Phone2 must be a string"),
];

const validateHeaderContactId = [
  param("id").isInt().withMessage("ID must be an integer"),
];

module.exports = { validateHeaderContact, validateHeaderContactId };
