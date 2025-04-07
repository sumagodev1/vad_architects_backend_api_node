const express = require('express');
const { upload } = require('../middleware/multer');
const { validateHomeSliderId } = require('../validations/homeSliderValidation');
const {
  addHomeSlider,
  updateHomeSlider,
  getHomeSlider,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/homeSlider');
const authenticateToken = require('../middleware/auth');
const imageRequired = require('../validations/imageValidation');

const router = express.Router();

router.post('/create-homeslider', upload.single('img'), imageRequired, authenticateToken, addHomeSlider);
router.put('/update-homeslider/:id', upload.single('img'), authenticateToken, validateHomeSliderId, updateHomeSlider);
router.get('/get-homeslider', getHomeSlider);
router.get('/find-homeslider', authenticateToken, getHomeSlider);
router.put('/isactive-homeslider/:id', authenticateToken, validateHomeSliderId, isActiveStatus);
router.delete('/isdelete-homeslider/:id', authenticateToken, validateHomeSliderId, isDeleteStatus);

module.exports = router;