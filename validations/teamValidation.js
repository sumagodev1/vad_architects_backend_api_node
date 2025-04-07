const { body, param } = require('express-validator');

exports.validateTeamMember = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  body('designation')
    .notEmpty()
    .withMessage('Designation is required')
    .isString()
    .withMessage('Designation must be a string'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  // body('position_no')
  //   .notEmpty()
  //   .withMessage('Position number is required')
  //   .isInt()
  //   .withMessage('Position number must be an integer'),
];

exports.validateTeamMemberId = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer'),
];
