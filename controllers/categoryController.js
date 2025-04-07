const apiResponse = require("../helper/apiResponse");
const Category = require("../models/Category");
// exports.addCategory = async (req, res) => {
//   try {
//     const { title, desc } = req.body;

//     const Category1 = await Category.create({
//       title,
//       isActive: true,
//       isDelete: false,
//     });
//     return apiResponse.successResponseWithData(
//       res,
//       "Category added successfully",
//       Category1
//     );
//   } catch (error) {
//     console.error("Add Category failed", error);
//     return apiResponse.ErrorResponse(res, "Add Category failed");
//   }
// };

exports.addCategory = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if the title is already taken by an active category
    const existingActiveCategory = await Category.findOne({ where: { title, isDelete: false } });

    if (existingActiveCategory) {
      return apiResponse.ErrorResponse(res, "Category with this title already exists.");
    }

    // Check if the title was deleted earlier, if yes, reactivate it by adding a new record
    const existingDeletedCategory = await Category.findOne({ where: { title, isDelete: true } });

    if (existingDeletedCategory) {
      // If the title is marked as deleted, create a new category with the same title but isDelete: false
      const newCategory = await Category.create({
        title,
        isActive: true,
        isDelete: false, // Mark as active
      });

      return apiResponse.successResponseWithData(
        res,
        "Category re-added successfully",
        newCategory
      );
    }

    // If no deleted category, create a new active category
    const newCategory = await Category.create({
      title,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      "Category added successfully",
      newCategory
    );
  } catch (error) {
    console.error("Add Category failed", error);
    return apiResponse.ErrorResponse(res, "Add Category failed");
  }
};


// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, desc } = req.body;

//     const Category1 = await Category.findByPk(id);
//     if (!Category1) {
//       return apiResponse.notFoundResponse(res, "Category not found");
//     }

//     Category1.title = title;
//     await Category1.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Category updated successfully",
//       Category1
//     );
//   } catch (error) {
//     console.error("Update Category failed", error);
//     return apiResponse.ErrorResponse(res, "Update Category failed");
//   }
// };

// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, desc } = req.body; // `desc` refers to sorting order

//     // Fetch the category by ID
//     const category = await Category.findByPk(id);
//     if (!category) {
//       return apiResponse.notFoundResponse(res, "Category not found");
//     }

//     // Check if another category already has the same title and it's not the current one
//     const existingCategory = await Category.findOne({ 
//       where: { 
//         title, 
//         isDelete: false // Ensure the category is not deleted
//       }
//     });

//     if (existingCategory && existingCategory.id !== parseInt(id)) {
//       return apiResponse.validationErrorWithData(
//         res,
//         "Category with this title already exists",
//         {}
//       );
//     }

//     // Update category if title is unique
//     category.title = title;
//     category.desc = desc; // Update the sorting order (description)
//     await category.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Category updated successfully",
//       category
//     );
//   } catch (error) {
//     console.error("Update Category failed", error);
//     return apiResponse.ErrorResponse(res, "Update Category failed");
//   }
// };

const sequelize = require('../config/database'); // Import the sequelize instance
const ProjectDetails = require('../models/ProjectDetails');
const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");

exports.updateCategory = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params;
    const { title, desc } = req.body; // `desc` refers to sorting order

    // Find category in the Category table
    const category = await Category.findByPk(id, { transaction });
    if (!category) {
      await transaction.rollback();
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    // Check if another category already has the same title in the Category table
    const existingCategories = await Category.findAll({ where: { title }, transaction });
    
    // Implementing new logic: Allow update if the same category is being updated, 
    // but prevent if another category has the same title and is not deleted
    if (existingCategories.length > 0) {
      const hasActiveCategory = existingCategories.some(cat => cat.isDelete === false && cat.id !== parseInt(id));
      if (hasActiveCategory) {
        await transaction.rollback();
        return apiResponse.validationErrorWithData(
          res,
          "Category with this title already exists",
          {}
        );
      }
    }

    // Update the Category table
    category.title = title; // Allow title update only if isDelete was true before
    category.desc = desc; // Update description (sorting order or other field)
    await category.save({ transaction });

    // Update ProjectDetails table where project_category_id matches the Category ID
    await ProjectDetails.update(
      { project_category_id: id, project_category: title }, // Update the related fields
      { where: { project_category_id: id }, transaction }
    );

    // Update ProjectDetailsWithImages table where project_category_id matches the Category ID
    await ProjectDetailsWithImages.update(
      { project_category: title }, // Update project_category in the second table
      { where: { project_category_id: id }, transaction }
    );

    await transaction.commit(); // Commit transaction if everything is successful

    return apiResponse.successResponseWithData(
      res,
      "Category updated successfully",
      category
    );
  } catch (error) {
    await transaction.rollback(); // Rollback in case of error
    console.error("Update Category failed", error);
    return apiResponse.ErrorResponse(res, "Update Category failed");
  }
};

// exports.updateCategory = async (req, res) => {
//   const transaction = await sequelize.transaction(); // Start a transaction
//   try {
//     const { id } = req.params;
//     const { title, desc } = req.body; // `desc` refers to sorting order

//     // Find category in the Category table
//     const category = await Category.findByPk(id, { transaction });
//     if (!category) {
//       await transaction.rollback();
//       return apiResponse.notFoundResponse(res, "Category not found");
//     }

//     // Check if another category already has the same title in the Category table
//     const existingCategory = await Category.findOne({ where: { title }, transaction });
//     if (existingCategory && existingCategory.id !== parseInt(id)) {
//       await transaction.rollback();
//       return apiResponse.validationErrorWithData(
//         res,
//         "Category with this title already exists",
//         {}
//       );
//     }

//     // Update the Category table
//     category.title = title;
//     category.desc = desc; // Update description (sorting order or other field)
//     await category.save({ transaction });

//     // Update ProjectDetails table where project_category_id matches the Category ID
//     await ProjectDetails.update(
//       { project_category_id: id, project_category: title }, // Update the related fields
//       { where: { project_category_id: id }, transaction }
//     );

//     // Update ProjectDetailsWithImages table where project_category_id matches the Category ID
//     await ProjectDetailsWithImages.update(
//       { project_category: title }, // Update project_category in the second table
//       { where: { project_category_id: id }, transaction }
//     );

//     await transaction.commit(); // Commit transaction if everything is successful

//     return apiResponse.successResponseWithData(
//       res,
//       "Category updated successfully",
//       category
//     );
//   } catch (error) {
//     await transaction.rollback(); // Rollback in case of error
//     console.error("Update Category failed", error);
//     return apiResponse.ErrorResponse(res, "Update Category failed");
//   }
// };

// exports.getCategory = async (req, res) => {
//   try {
//     const Category1 = await Category.findAll({
//       where: { isDelete: false },
//     });

//     // Base URL for images
//     // const baseUrl = `${process.env.SERVER_PATH}`; // Adjust according to your setup
//     // console.log("baseUrl....", baseUrl);
//     // const CategoryWithBaseUrl = Category.map((Category) => {
//     //   console.log("Category.img", Category.img);
//     //   return {
//     //     ...Category.toJSON(), // Convert Sequelize instance to plain object
//     //     img: Category.img
//     //       ? baseUrl + Category.img.replace(/\\/g, "/")
//     //       : null,
//     //   };
//     // });

//     return apiResponse.successResponseWithData(
//       res,
//       "Category retrieved successfully",
//       Category1
//     );
//   } catch (error) {
//     console.error("Get Category failed", error);
//     return apiResponse.ErrorResponse(res, "Get Category failed");
//   }
// };

exports.getCategory = async (req, res) => {
  try {
    
    const categories = await Category.findAll({
      where: { isDelete: false }, // Exclude deleted categories
    });

    // Fetch all active projects
    const activeProjects = await ProjectDetails.findAll({
      where: { isActive: true },
      attributes: ['project_category_id'],
    });

    // Get category IDs that have active projects
    const activeCategoryIds = new Set(activeProjects.map(project => project.project_category_id));

    // Sort categories based on whether they have active projects
    const sortedCategories = categories.sort((a, b) => {
      const aHasProject = activeCategoryIds.has(a.id);
      const bHasProject = activeCategoryIds.has(b.id);

      if (aHasProject && !bHasProject) return -1;
      if (!aHasProject && bHasProject) return 1;
      return 0;
    });
  

    return apiResponse.successResponseWithData( 
      res,
      "Category retrieved successfully",
      sortedCategories
    );
  } catch (error) {
    console.error("Get Category failed", error);
    return apiResponse.ErrorResponse(res, "Get Category failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const Category1 = await Category.findByPk(id);

    if (!Category1) {
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    Category1.isActive = !Category1.isActive;
    await Category1.save();

    return apiResponse.successResponseWithData(
      res,
      "Category status updated successfully",
      Category1
    );
  } catch (error) {
    console.error("Toggle Category status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle Category status failed"
    );
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const Category1 = await Category.findByPk(id);

    if (!Category1) {
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    Category1.isDelete = !Category1.isDelete;
    await Category1.save();

    return apiResponse.successResponseWithData(
      res,
      "Category delete status updated successfully",
      Category1
    );
  } catch (error) {
    console.error("Toggle Category delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle Category delete status failed"
    );
  }
};
