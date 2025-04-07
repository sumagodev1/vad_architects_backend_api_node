const { body, param } = require('express-validator');

const validateCategory = [
  body('title').notEmpty().withMessage('Title is required'),
  // body('desc').notEmpty().withMessage('desc is required')
];

const validateCategoryId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateCategory, validateCategoryId };
