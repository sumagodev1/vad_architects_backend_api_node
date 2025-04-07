const { param } = require("express-validator");

const validateCarrousalId = [
  param("id").isInt().withMessage("ID must be an integer"),
];

module.exports = { validateCarrousalId };
