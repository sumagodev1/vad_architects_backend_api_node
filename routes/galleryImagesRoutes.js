const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerformultigalleryimages");
const {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImageById,
  updateIsActive,
  updateGalleryImageImages,deleteGalleryImageImage,
  updateIsDelete,
} = require("../controllers/GalleryImageDetailsWithImagesController");
const authenticateToken = require('../middleware/auth');

// Create a GalleryImage with multiple images
router.post(
  "/create-galleryImageDetailsWithImages",
  upload.array("gallery_images"), authenticateToken,
  createGalleryImage
);

// Get all GalleryImages
router.get("/galleryImages", getAllGalleryImages);

// Get a single GalleryImage by ID
router.get("/galleryImages/:gallery_category_id", getGalleryImageById);

router.put("/galleryImages/:id/is-active", authenticateToken, updateIsActive);

// Update isDelete status
router.delete("/galleryImages/:id/is-delete", authenticateToken, updateIsDelete);

router.put(
  "/galleryImages/:id/images",
  upload.array("gallery_images"), authenticateToken,
  updateGalleryImageImages
);

// Delete a specific image
router.delete("/galleryImages/:id/delete-image", authenticateToken, deleteGalleryImageImage);
module.exports = router;
