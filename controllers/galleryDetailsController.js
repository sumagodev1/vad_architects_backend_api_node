const apiResponse = require('../helper/apiResponse');
const GalleryDetails = require('../models/GalleryDetails')

// Backend: Check and create gallery category

exports.addGalleryDetails = async (req, res) => {
  try {
    const { gallery_category } = req.body;

    // Check if a gallery category exists with isDelete false
    const activeGallery = await GalleryDetails.findOne({
      where: { gallery_category, isDelete: false },
    });

    if (activeGallery) {
      return apiResponse.validationErrorWithData(
        res,
        "Gallery category already exists",
        {}
      );
    }

    // If a deleted category exists, do NOT restore it; create a new record instead
    const img = req.file ? req.file.path : null;

    const newGallery = await GalleryDetails.create({
      img,
      gallery_category,
      isActive: true,
      isDelete: false, // New record is active
    });

    return apiResponse.successResponseWithData(
      res,
      "Gallery category added successfully",
      newGallery
    );
  } catch (error) {
    console.error("Add gallery category failed", error);
    return apiResponse.ErrorResponse(res, "Add gallery category failed");
  }
};

// exports.addGalleryDetails = async (req, res) => {
//   try {
//     const { gallery_category } = req.body;

//     // Check if a gallery category exists in any state (deleted or active)
//     const existingGallery = await GalleryDetails.findOne({
//       where: { gallery_category },
//     });

//     if (existingGallery) {
//       if (existingGallery.isDelete) {
//         // If the category exists but is deleted, restore it
//         await existingGallery.update({ isDelete: false, isActive: true });

//         return apiResponse.successResponseWithData(
//           res,
//           "Gallery category restored successfully",
//           existingGallery
//         );
//       } else {
//         // If the category exists and is active, prevent duplication
//         return apiResponse.validationErrorWithData(
//           res,
//           "Gallery category already exists",
//           {}
//         );
//       }
//     }

//     // If no existing category, create a new record
//     const img = req.file ? req.file.path : null;

//     const newGallery = await GalleryDetails.create({
//       img,
//       gallery_category,
//       isActive: true,
//       isDelete: false, // New record is active
//     });

//     return apiResponse.successResponseWithData(
//       res,
//       "Gallery category added successfully",
//       newGallery
//     );
//   } catch (error) {
//     console.error("Add gallery category failed", error);
//     return apiResponse.ErrorResponse(res, "Add gallery category failed");
//   }
// };

// exports.updateGalleryDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { gallery_category, desc } = req.body;
//     const img = req.file ? req.file.path : null;

//     const GalleryDetails1 = await GalleryDetails.findByPk(id);
//     if (!GalleryDetails1) {
//       return apiResponse.notFoundResponse(res, 'Gallery category not found');
//     }

//         // Check if another category already has the same title
//         const existinggallery_category = await GalleryDetails.findOne({ where: { gallery_category } });
//         if (existinggallery_category && existinggallery_category.id !== parseInt(id)) {
//           return apiResponse.validationErrorWithData(
//             res,
//             "Gallery category already exists when update",
//             {}
//           );
//         }

//     GalleryDetails1.img = img || GalleryDetails1.img;
//     GalleryDetails1.gallery_category = gallery_category;
//     await GalleryDetails1.save();

//     return apiResponse.successResponseWithData(res, 'Gallery category updated successfully', GalleryDetails1);
//   } catch (error) {
//     console.error('Update gallery category failed', error);
//     return apiResponse.ErrorResponse(res, 'Update gallery category failed');
//   }
// };

const sequelize = require('../config/database'); // Import the sequelize instance
const GalleryImageDetailsWithImages = require("../models/GalleryImageDetailsWithImages");
const { Op } = require("sequelize"); // Import Sequelize operators

exports.updateGalleryDetails = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params;
    const { gallery_category, desc } = req.body;
    const img = req.file ? req.file.path : null;

    const GalleryDetails1 = await GalleryDetails.findByPk(id);
    if (!GalleryDetails1) {
      return apiResponse.notFoundResponse(res, 'Gallery category not found');
    }

    // Check if another category (excluding the current one) already has the same title, regardless of isDelete status
    const existingGalleryCategory = await GalleryDetails.findOne({
      where: {
        gallery_category,
        id: { [Op.ne]: id }, // Exclude the current record
        isDelete: 0 // Ensure it's not a deleted category
      }
    });

    // Additional check: Allow update if the category name remains the same but only the image is changed
    if (existingGalleryCategory && gallery_category !== GalleryDetails1.gallery_category) {
      return apiResponse.validationErrorWithData(
        res,
        "Gallery category already exists when updating",
        {}
      );
    }

    // Update the GalleryDetails table
    GalleryDetails1.img = img || GalleryDetails1.img;
    GalleryDetails1.gallery_category = gallery_category;
    await GalleryDetails1.save({ transaction });

    // Update the GalleryImageDetailsWithImages table where gallery_category_id matches the id
    await GalleryImageDetailsWithImages.update(
      { gallery_category: gallery_category }, // Update gallery_category in the second table
      { where: { gallery_category_id: id }, transaction }
    );

    await transaction.commit(); // Commit transaction if everything is successful

    return apiResponse.successResponseWithData(res, 'Gallery category updated successfully', GalleryDetails1);
  } catch (error) {
    await transaction.rollback(); // Rollback in case of error
    console.error('Update gallery category failed', error);
    return apiResponse.ErrorResponse(res, 'Update gallery category failed');
  }
};


// last working code

// exports.updateGalleryDetails = async (req, res) => {
//   const transaction = await sequelize.transaction(); // Start a transaction
//   try {
//     const { id } = req.params;
//     const { gallery_category, desc } = req.body;
//     const img = req.file ? req.file.path : null;

//     const GalleryDetails1 = await GalleryDetails.findByPk(id);
//     if (!GalleryDetails1) {
//       return apiResponse.notFoundResponse(res, 'Gallery category not found');
//     }

//     // Check if another category (excluding the current one) already has the same title, regardless of isDelete status
//     const existingGalleryCategory = await GalleryDetails.findOne({
//       where: {
//         gallery_category,
//         id: { [Op.ne]: id }, // Exclude the current record
//       }
//     });

//     if (existingGalleryCategory) {
//       return apiResponse.validationErrorWithData(
//         res,
//         "Gallery category already exists when updating",
//         {}
//       );
//     }

//     // Update the GalleryDetails table
//     GalleryDetails1.img = img || GalleryDetails1.img;
//     GalleryDetails1.gallery_category = gallery_category;
//     await GalleryDetails1.save({ transaction });

//     // Update the GalleryImageDetailsWithImages table where gallery_category_id matches the id
//     await GalleryImageDetailsWithImages.update(
//       { gallery_category: gallery_category }, // Update gallery_category in the second table
//       { where: { gallery_category_id: id }, transaction }
//     );

//     await transaction.commit(); // Commit transaction if everything is successful

//     return apiResponse.successResponseWithData(res, 'Gallery category updated successfully', GalleryDetails1);
//   } catch (error) {
//     await transaction.rollback(); // Rollback in case of error
//     console.error('Update gallery category failed', error);
//     return apiResponse.ErrorResponse(res, 'Update gallery category failed');
//   }
// };



exports.getGalleryDetails = async (req, res) => {
  try {
    const GalleryDetails1 = await GalleryDetails.findAll({ where: { isDelete: false } });
    
    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`; // Adjust according to your setup
    console.log("baseUrl....", baseUrl);
    const GalleryDetailsWithBaseUrl = GalleryDetails1.map(GalleryDetails1 => {
      console.log("Project Details.img", GalleryDetails1.img);
      return {
        ...GalleryDetails1.toJSON(), // Convert Sequelize instance to plain object
        img: GalleryDetails1.img ? baseUrl + GalleryDetails1.img.replace(/\\/g, '/') : null 
      };
    });

    return apiResponse.successResponseWithData(res, 'Gallery category retrieved successfully', GalleryDetailsWithBaseUrl);
  } catch (error) {
    console.error('Get Gallery category failed', error);
    return apiResponse.ErrorResponse(res, 'Get Gallery category failed');
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const GalleryDetails1 = await GalleryDetails.findByPk(id);

    if (!GalleryDetails1) {
      return apiResponse.notFoundResponse(res, 'Gallery category not found');
    }

    GalleryDetails1.isActive = !GalleryDetails1.isActive;
    await GalleryDetails1.save();

    return apiResponse.successResponseWithData(res, 'Gallery category status updated successfully', GalleryDetails1);
  } catch (error) {
    console.error('Toggle Gallery category status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle Gallery category status failed');
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const GalleryDetails1 = await GalleryDetails.findByPk(id);

    if (!GalleryDetails1) {
      return apiResponse.notFoundResponse(res, 'Gallery category not found');
    }

    GalleryDetails1.isDelete = !GalleryDetails1.isDelete;
    await GalleryDetails1.save();

    return apiResponse.successResponseWithData(res, 'Gallery category delete status updated successfully', GalleryDetails1);
  } catch (error) {
    console.error('Toggle Gallery category delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle Gallery category delete status failed');
  }
};
