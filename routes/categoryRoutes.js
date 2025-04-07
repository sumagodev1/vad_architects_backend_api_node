const express = require('express');
const { validateCategory, validateCategoryId } = require('../validations/categoryValidation');
const {
  addCategory,
  updateCategory,
  getCategory,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/categoryController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-category', authenticateToken, validateCategory, addCategory);
router.put('/update-category/:id', authenticateToken, validateCategory, validateCategoryId, updateCategory);
router.get('/get-category', getCategory);
router.get('/find-category', authenticateToken, getCategory);
router.put('/isactive-category/:id', authenticateToken, validateCategoryId, isActiveStatus);
router.delete('/isdelete-category/:id', authenticateToken, validateCategoryId, isDeleteStatus);

module.exports = router;
