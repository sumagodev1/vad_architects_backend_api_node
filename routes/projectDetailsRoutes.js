const express = require('express');
const { upload } = require('../middleware/multer');
const { validateProjectDetails, validateProjectDetailsId } = require('../validations/projectDetailsValidation');
const {
  addProjectDetails,
  updateProjectDetails,
  getProjectDetails,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/projectDetailsController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-projectDetails', upload.single('img'), authenticateToken, validateProjectDetails, addProjectDetails);
router.put('/update-projectDetails/:id', upload.single('img'), authenticateToken, validateProjectDetails, validateProjectDetailsId, updateProjectDetails);
router.get('/get-projectDetails', getProjectDetails);
router.get('/find-projectDetails', authenticateToken, getProjectDetails);
router.put('/isactive-projectDetails/:id', authenticateToken, validateProjectDetailsId, isActiveStatus);
router.delete('/isdelete-projectDetails/:id', authenticateToken, validateProjectDetailsId, isDeleteStatus);

module.exports = router;
