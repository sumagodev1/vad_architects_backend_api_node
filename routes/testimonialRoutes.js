const express = require('express');
const { upload } = require('../middleware/multer');
const { validateTestimonial, validateTestimonialId } = require('../validations/testimonialValidation');
const {
  addTestimonial,
  updateTestimonial,
  getTestimonials,
  isActiveStatus,
  isDeleteStatus,
  toggleFeatureTestimonial
} = require('../controllers/testimonialController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-testimonials', upload.single('img'), authenticateToken, validateTestimonial, addTestimonial);
router.put('/update-testimonials/:id', upload.single('img'), authenticateToken, validateTestimonial, validateTestimonialId, updateTestimonial);
router.get('/get-testimonials', getTestimonials);
router.get('/find-testimonials', authenticateToken, getTestimonials);
router.put('/isactive-testimonial/:id', authenticateToken, validateTestimonialId, isActiveStatus);
router.delete('/isdelete-testimonial/:id', authenticateToken, validateTestimonialId, isDeleteStatus);

router.put('/feature-testimonial/:id', authenticateToken, validateTestimonialId, toggleFeatureTestimonial);


module.exports = router;