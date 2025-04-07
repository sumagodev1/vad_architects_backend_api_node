const { body, param } = require('express-validator');

const validateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is required and must be a valid email'),
  body('mobile').notEmpty().withMessage('Mobile is required'),
];

const validateContactId = [
  param('id').isInt().withMessage('ID must be an integer'),
];

module.exports = { validateContact, validateContactId };
