const express = require('express');
const { upload } = require('../middleware/multer');
const { validateGalleryDetails, validateGalleryDetailsId } = require('../validations/galleryDetailsValidation');
const {
  addGalleryDetails,
  updateGalleryDetails,
  getGalleryDetails,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/galleryDetailsController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-galleryDetails', upload.single('img'), authenticateToken,  addGalleryDetails);
router.put('/update-galleryDetails/:id', upload.single('img'), authenticateToken, validateGalleryDetailsId, updateGalleryDetails);
router.get('/get-galleryDetails', getGalleryDetails);
router.get('/find-galleryDetails', authenticateToken, getGalleryDetails);
router.put('/isactive-galleryDetails/:id', authenticateToken, validateGalleryDetailsId, isActiveStatus);
router.delete('/isdelete-galleryDetails/:id', authenticateToken, validateGalleryDetailsId, isDeleteStatus);

module.exports = router;
