const { body, param } = require('express-validator');

const validateProjectDetails = [
  body('project_category').notEmpty().withMessage('Title is required'),
  body('project_name').notEmpty().withMessage('Project Name is required'),
  body('project_location').notEmpty().withMessage('Project Location is required')
];

const validateProjectDetailsId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateProjectDetails, validateProjectDetailsId };
