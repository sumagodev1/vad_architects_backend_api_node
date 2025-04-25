// const express = require('express');
// const { upload2 } = require('../middleware/multer');
// const { validateProjectDetails, validateProjectDetailsId } = require('../validations/projectDetailsValidation');
// const {
//   addProjectDetailsWithImages,
//   updateProjectDetailsWithImages,
//   getProjectDetailsWithImages,
//   isActiveStatus,
//   isDeleteStatus
// } = require('../controllers/projectDetailsWithImagesController');
// const authenticateToken = require('../middleware/auth');

// const router = express.Router();

// router.post('/create-projectDetailsWithImages', upload2, validateProjectDetails, addProjectDetailsWithImages);
// router.put('/update-projectDetailsWithImages/:id', upload2, authenticateToken, validateProjectDetails, validateProjectDetailsId, updateProjectDetailsWithImages);
// router.get('/get-projectDetailsWithImages', getProjectDetailsWithImages);
// router.get('/find-projectDetailsWithImages', authenticateToken, getProjectDetailsWithImages);
// router.put('/isactive-projectDetailsWithImages/:id', authenticateToken, validateProjectDetailsId, isActiveStatus);
// router.delete('/isdelete-projectDetailsWithImages/:id', authenticateToken, validateProjectDetailsId, isDeleteStatus);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerformultiimages");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateIsActive,
  updateProjectImages,deleteProjectImage,
  updateIsDelete,
} = require("../controllers/projectDetailsWithImagesController");
const authenticateToken = require('../middleware/auth');

// Create a project with multiple images
// router.post(
//   "/create-projectDetailsWithImages",
//   upload.array("project_images"), authenticateToken,
//   createProject
// );

router.post(
  "/create-projectDetailsWithImages",
  upload.fields([
    { name: "before_img", maxCount: 1 },
    { name: "planning_img", maxCount: 1 },
    { name: "after_img", maxCount: 1 },
    { name: "project_images", maxCount: 10 },
    { name: "client_img", maxCount: 1 },
    { name: "hero_img", maxCount: 1 },
  ]),
  authenticateToken,
  createProject
);

router.put(
  "/projects/:id/images",
  upload.fields([
    { name: "before_img", maxCount: 1 },
    { name: "planning_img", maxCount: 1 },
    { name: "after_img", maxCount: 1 },
    { name: "project_images", maxCount: 10 },
    { name: "client_img", maxCount: 1 },
    { name: "hero_img", maxCount: 1 },
  ]), authenticateToken,
  updateProjectImages
);

// Get all projects
router.get("/projects", getAllProjects);

// Get a single project by ID
router.get("/projects/:project_name_id", getProjectById);

router.put("/projects/:id/is-active", authenticateToken, updateIsActive);

// Update isDelete status
router.delete("/projects/:id/is-delete", authenticateToken, updateIsDelete);

// router.put(
//   "/projects/:id/images",
//   upload.array("project_images", 5), authenticateToken,
//   updateProjectImages
// );

// Delete a specific image
router.delete("/projects/:id/delete-image", authenticateToken, deleteProjectImage);
module.exports = router;
