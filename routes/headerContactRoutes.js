const express = require('express');
const { addHeaderContact, updateHeaderContact, getHeaderContact, isActiveStatus, isDeleteStatus } = require('../controllers/headerContactController');
const { validateHeaderContact, validateHeaderContactId } = require('../validations/headerContactValidation');
const { validationResult } = require('express-validator');
const apiResponse = require('../helper/apiResponse');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Add header contact
router.post('/create-headercontact', validateHeaderContact, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
  }
  next();
}, addHeaderContact);

// Add header contact
router.post('/createheadercontact', authenticateToken, validateHeaderContact, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
  }
  next();
}, addHeaderContact);

// Update header contact
router.put('/headercontact/:id', authenticateToken, validateHeaderContactId, validateHeaderContact, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.validationErrorWithData(res, 'Validation Error', errors.array());
  }
  next();
}, updateHeaderContact);

// Get header contacts
router.get('/getheaderContacts', getHeaderContact);
router.get('/findheadercontacts', authenticateToken, getHeaderContact);

module.exports = router;

// Toggle header contact status
router.put('/isactive/:id', authenticateToken, validateHeaderContactId, isActiveStatus);

// Toggle header contact delete status
router.delete('/isdelete/:id', authenticateToken, validateHeaderContactId, isDeleteStatus);
