const { body, param } = require('express-validator');

const validateGalleryDetails = [
  body('gallery_category').notEmpty().withMessage('gallery category is required'),
];

const validateGalleryDetailsId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateGalleryDetails, validateGalleryDetailsId };
