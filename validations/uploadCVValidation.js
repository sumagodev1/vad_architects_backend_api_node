const { body, param } = require('express-validator');

const validateUploadCV = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

const validateUploadCVId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateUploadCV, validateUploadCVId };
