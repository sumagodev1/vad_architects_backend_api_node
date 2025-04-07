const GalleryImageDetailsWithImages = require("../models/GalleryImageDetailsWithImages");
const fs = require("fs");
const path = require("path");
// Upload multiple images
// const createGalleryImage = async (req, res) => {
//   try {
//     const { gallery_category_id, gallery_category } = req.body;

//     // Get image file paths
//     // const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
//     const imagePaths = req.files.map(
//       (file) => `uploads/galleryImages/${file.filename}`
//     );

//     // Create gallery entry in the database
//     const gallery = await GalleryImageDetailsWithImages.create({
//       gallery_category_id,
//       gallery_category,
//       gallery_images: imagePaths,
//     });

//     res.status(201).json({ message: "gallery created successfully!", gallery });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// last working code

// const createGalleryImage = async (req, res) => {
//   try {
//     const { gallery_category_id, gallery_category } = req.body;

//     // Check if gallery_category already exists
//     const existingCategory = await GalleryImageDetailsWithImages.findOne({
//       where: { gallery_category },
//     });

//     if (existingCategory) {
//       return res.status(400).json({
//         message: "Gallery category already exists. Please choose another name.",
//       });
//     }

//     // Get image file paths
//     const imagePaths = req.files.map(
//       (file) => `uploads/galleryImages/${file.filename}`
//     );

//     // Create gallery entry in the database
//     const gallery = await GalleryImageDetailsWithImages.create({
//       gallery_category_id,
//       gallery_category,
//       gallery_images: imagePaths,
//     });

//     res.status(201).json({
//       message: "Gallery created successfully!",
//       gallery,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createGalleryImage = async (req, res) => {
  try {
    const { gallery_category_id, gallery_category } = req.body;

    // Check if an active gallery_category already exists
    const activeCategory = await GalleryImageDetailsWithImages.findOne({
      where: { gallery_category, isDelete: false },
    });

    if (activeCategory) {
      return res.status(400).json({
        message: "Gallery category already exists. Please choose another name.",
      });
    }

    // Get image file paths
    const imagePaths = req.files.map(
      (file) => `uploads/galleryImages/${file.filename}`
    );

    // Create new gallery entry in the database (even if a deleted one exists)
    const gallery = await GalleryImageDetailsWithImages.create({
      gallery_category_id,
      gallery_category,
      gallery_images: imagePaths,
      isDelete: false, // Ensure new entry is active
    });

    res.status(201).json({
      message: "Gallery created successfully!",
      gallery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all gallerys
const getAllGalleryImages = async (req, res) => {
  try {
    const gallery = await GalleryImageDetailsWithImages.findAll({
      where: { isDelete: false },
    });
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single gallery by ID
// const getGalleryImageById = async (req, res) => {
//   try {
//     const { gallery_category_id } = req.params; // Get gallery_category_id from request parameters
//     const gallery = await GalleryImageDetailsWithImages.findOne({
//       where: { gallery_category_id }, // Query by gallery_category_id
//     });

//     if (!gallery) {
//       return res.status(404).json({ message: "Gallery not found" });
//     }

//     res.status(200).json(gallery);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

  const getGalleryImageById = async (req, res) => {
    try {
      const { gallery_category_id } = req.params;

      const gallery = await GalleryImageDetailsWithImages.findOne({
        where: { gallery_category_id },
      });

      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }

      // Ensure that gallery_images is an array (Sequelize handles this automatically)
      let galleryImages = gallery.gallery_images;

      if (typeof galleryImages === "string") {
        // If it's a string, try parsing it manually
        try {
          galleryImages = JSON.parse(galleryImages);
        } catch (error) {
          console.error("Error parsing gallery_images:", error);
          return res
            .status(500)
            .json({ message: "Error parsing gallery images" });
        }
      }

      res.status(200).json({
        ...gallery.toJSON(),
        gallery_images: galleryImages, // Ensure it's an array
      });
    } catch (error) {
      console.error("Error fetching gallery by ID:", error);
      res.status(500).json({ error: error.message });
    }
  };
const updateIsActive = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isActive } = req.body;

    const gallery = await GalleryImageDetailsWithImages.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ message: "gallery not found" });
    }

    gallery.isActive = !gallery.isActive; // Update isActive status
    await gallery.save();

    res
      .status(200)
      .json({ message: "isActive status updated successfully", gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { Op } = require("sequelize");

const updateGalleryImageImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { gallery_category_id, gallery_category } = req.body;

    const gallery = await GalleryImageDetailsWithImages.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Check if another active gallery category with the same name exists
    const existingActiveCategory = await GalleryImageDetailsWithImages.findOne({
      where: { gallery_category, isDelete: false, id: { [Op.ne]: id } },
    });

    if (existingActiveCategory) {
      return res.status(400).json({
        message: "Gallery category already exists in active records. Please choose another name.",
      });
    }

    // Allow updating if the same gallery_category exists but is deleted
    const existingDeletedCategory = await GalleryImageDetailsWithImages.findOne({
      where: { gallery_category, isDelete: true },
    });

    if (gallery.gallery_category !== gallery_category && !existingDeletedCategory) {
      return res.status(400).json({
        message: "Gallery category already exists in active records. Cannot update with this name.",
      });
    }

    // Ensure existingImages is always an array
    let existingImages = gallery.gallery_images;
    if (typeof existingImages === "string") {
      existingImages = JSON.parse(existingImages);
    }
    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }

    // Get new image paths
    let newImages = req.files.map(
      (file) => `uploads/galleryImages/${file.filename}`
    );

    // Merge old and new images
    const updatedImages = [...existingImages, ...newImages];

    // Update the gallery fields
    gallery.gallery_images = updatedImages;
    gallery.gallery_category_id = gallery_category_id;
    gallery.gallery_category = gallery_category;

    await gallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// const updateGalleryImageImages = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { gallery_category_id, gallery_category } = req.body; // Get the updated fields from the body

//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);
//     if (!gallery) {
//       return res.status(404).json({ message: "gallery not found" });
//     }

//     // Parse existing images properly (ensure it's always an array)
//     let existingImages = gallery.gallery_images;
//     if (typeof existingImages === "string") {
//       existingImages = JSON.parse(existingImages); // Fix for string issue
//     }
//     if (!Array.isArray(existingImages)) {
//       existingImages = [];
//     }

//     // Get new image paths from uploaded files
//     let newImages = req.files.map(
//       (file) => `uploads/galleryImages/${file.filename}`
//     );

//     // Merge old and new images
//     const updatedImages = [...existingImages, ...newImages];

//     // Update the gallery fields
//     gallery.gallery_images = updatedImages;
//     gallery.gallery_category_id = gallery_category_id; // Update the category ID
//     gallery.gallery_category = gallery_category; // Update the category name

//     await gallery.save();

//     res.status(200).json({ message: "Gallery updated successfully", gallery });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// last working code

// const updateGalleryImageImages = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { gallery_category_id, gallery_category } = req.body;

//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);
//     if (!gallery) {
//       return res.status(404).json({ message: "Gallery not found" });
//     }

//     // Check if another gallery category with the same name exists
//     const existingCategory = await GalleryImageDetailsWithImages.findOne({
//       where: { gallery_category },
//     });

//     if (existingCategory && existingCategory.id !== parseInt(id)) {
//       return res.status(400).json({
//         message: "Gallery category already exists. Please choose another name.",
//       });
//     }

//     // Ensure existingImages is always an array
//     let existingImages = gallery.gallery_images;
//     if (typeof existingImages === "string") {
//       existingImages = JSON.parse(existingImages);
//     }
//     if (!Array.isArray(existingImages)) {
//       existingImages = [];
//     }

//     // Get new image paths
//     let newImages = req.files.map(
//       (file) => `uploads/galleryImages/${file.filename}`
//     );

//     // Merge old and new images
//     const updatedImages = [...existingImages, ...newImages];

//     // Update the gallery fields
//     gallery.gallery_images = updatedImages;
//     gallery.gallery_category_id = gallery_category_id;
//     gallery.gallery_category = gallery_category;

//     await gallery.save();

//     res.status(200).json({
//       message: "Gallery updated successfully",
//       gallery,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const deleteGalleryImageImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { imagePath } = req.body; // The image URL to delete

//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);
//     if (!gallery) {
//       return res.status(404).json({ message: "gallery not found" });
//     }

//     // Parse the stringified JSON array into an actual array
//     let images = [];
//     try {
//       images = JSON.parse(gallery.gallery_images);
//     } catch (error) {
//       return res.status(500).json({ message: "Error parsing images" });
//     }

//     // Normalize the imagePath format to match the stored paths
//     const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;

//     // Check if the image exists in the gallery
//     console.log(normalizedImagePath)
//     if (!images.includes(normalizedImagePath)) {
//       return res.status(400).json({ message: "Image not found in gallery" });
//     }

//     // Remove the image from the array
//     gallery.gallery_images = images.filter((img) => img !== normalizedImagePath);

//     // Delete the image from the server
//   //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
//   const fullPath = path.join(__dirname, "..", "uploads/galleryImages", path.basename(normalizedImagePath));

//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath); // Delete file
//     }

//     await gallery.save();
//     res.status(200).json({ message: "Image deleted successfully", gallery });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update isDelete status

// const deleteGalleryImageImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { imagePath } = req.body; // The image URL to delete

//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);
//     if (!gallery) {
//       return res.status(404).json({ message: "gallery not found" });
//     }

//     console.log("Raw gallery_images from DB:", gallery.gallery_images);

//     // Parse the stringified JSON array into an actual array
//     let images = [];
//     try {
//       images = JSON.parse(gallery.gallery_images);
//     } catch (error) {
//       return res.status(500).json({ message: "Error parsing images" });
//     }

//     // Normalize the imagePath format to match the stored paths
//     const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;

//     // Check if the image exists in the project
//     console.log(normalizedImagePath)
//     if (!images.includes(normalizedImagePath)) {
//       return res.status(400).json({ message: "Image not found in project" });
//     }

//     // Remove the image from the array
//     gallery.gallery_images = images.filter((img) => img !== normalizedImagePath);

//     // Delete the image from the server
//   //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
//   const fullPath = path.join(__dirname, "..", "uploads/galleryImages", path.basename(normalizedImagePath));

//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath); // Delete file
//     }

//     await project.save();
//     res.status(200).json({ message: "Image deleted successfully", project });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteGalleryImageImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { imagePath } = req.body; // Image URL sent from the frontend

//     // Fetch gallery from DB
//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);

//     if (!gallery) {
//       return res.status(404).json({ message: "Gallery not found" });
//     }

//     console.log("Raw gallery_images from DB:", gallery.gallery_images);

//     // Ensure gallery_images is an array
//     let images = [];
//     if (typeof gallery.gallery_images === "string") {
//       // If stored as a JSON string, parse it
//       try {
//         images = JSON.parse(gallery.gallery_images);
//       } catch (error) {
//         console.error("JSON Parse Error:", error);
//         return res
//           .status(500)
//           .json({ message: "Error parsing gallery images" });
//       }
//     } else if (Array.isArray(gallery.gallery_images)) {
//       images = gallery.gallery_images;
//     } else {
//       return res
//         .status(500)
//         .json({ message: "Invalid data format for gallery_images" });
//     }

//     console.log("Parsed images array:", images);

//     // Normalize imagePath (remove leading slash if present)
//     const normalizedImagePath = imagePath.startsWith("/")
//       ? imagePath.substring(1)
//       : imagePath;

//     // Check if the image exists in the gallery
//     if (!images.includes(normalizedImagePath)) {
//       return res.status(400).json({ message: "Image not found in gallery" });
//     }

//     // Remove the image from the array
//     const updatedImages = images.filter((img) => img !== normalizedImagePath);

//     // Construct file path for deletion
//     const fullPath = path.join(
//       __dirname,
//       "..",
//       "uploads/galleryImages",
//       path.basename(normalizedImagePath)
//     );

//     // Check and delete the file if it exists
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//     }

//     // Save the updated images array back to DB
//     gallery.gallery_images = JSON.stringify(updatedImages); // Convert array back to JSON string
//     await gallery.save();

//     res.status(200).json({
//       message: "Image deleted successfully",
//       gallery: { ...gallery.toJSON(), gallery_images: updatedImages }, // Ensure correct format
//     });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ error: error.message || "Something went wrong" });
//   }
// };
const deleteGalleryImageImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;

    // Fetch gallery from DB
    const gallery = await GalleryImageDetailsWithImages.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    console.log("Raw gallery_images from DB:", gallery.gallery_images);

    // Ensure gallery_images is properly parsed
    let images = [];
    try {
      images =
        typeof gallery.gallery_images === "string"
          ? JSON.parse(gallery.gallery_images) // Ensure JSON string is parsed properly
          : gallery.gallery_images || [];

      if (!Array.isArray(images)) {
        throw new Error("Invalid data format for gallery_images");
      }
    } catch (error) {
      console.error("JSON Parse Error:", error);
      return res.status(500).json({ message: "Error parsing gallery images" });
    }

    console.log("Parsed images array:", images);

    // Normalize the image path
    const normalizedImagePath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;

    // Check if the image exists
    if (!images.includes(normalizedImagePath)) {
      return res.status(400).json({ message: "Image not found in gallery" });
    }

    // Remove the image
    const updatedImages = images.filter((img) => img !== normalizedImagePath);

    // Construct file path
    const fullPath = path.join(
      __dirname,
      "..",
      "uploads/galleryImages",
      path.basename(normalizedImagePath)
    );

    // Delete file if exists
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Save updated images array correctly (without double encoding)
    gallery.gallery_images = updatedImages; // Store as array
    await gallery.save();

    res.status(200).json({
      message: "Image deleted successfully",
      gallery: { ...gallery.toJSON(), gallery_images: updatedImages }, // Send as array
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

const updateIsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isDelete } = req.body;

    const gallery = await GalleryImageDetailsWithImages.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ message: "gallery not found" });
    }

    gallery.isDelete = !gallery.isDelete; // Update isDelete status
    await gallery.save();

    res
      .status(200)
      .json({ message: "isDelete status updated successfully", gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateIsDelete = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the gallery record by ID
//     const gallery = await GalleryImageDetailsWithImages.findByPk(id);
//     if (!gallery) {
//       return res.status(404).json({ message: "Gallery not found" });
//     }

//     // Permanently delete the record from the database
//     await gallery.destroy();

//     res.status(200).json({ message: "Gallery deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


module.exports = {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryImageById,
  updateIsActive,
  updateIsDelete,
  deleteGalleryImageImage,
  updateGalleryImageImages,
};
