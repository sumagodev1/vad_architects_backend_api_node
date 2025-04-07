const { param } = require("express-validator");

const validateHomeSliderId = [
  param("id").isInt().withMessage("ID must be an integer"),
];

module.exports = { validateHomeSliderId };
