const Category = require('../models/Category');
const ProjectDetails = require('../models/ProjectDetails');
const ProjectDetailsWithImages = require('../models/ProjectDetailsWithImages');

/**
 * Runs both DB existence checks in parallel — O(1) per table, no full scans.
 * Uses findOne with minimal attribute projection to reduce data transfer.
 */
const checkCategoryUsage = async (categoryId) => {
  const [usedInDetails, usedInImages] = await Promise.all([
    ProjectDetails.findOne({
      where: { project_category_id: categoryId, isDelete: false },
      attributes: ['id'],
    }),
    ProjectDetailsWithImages.findOne({
      where: { project_category_id: categoryId, isDelete: false },
      attributes: ['id'],
    }),
  ]);

  return {
    usedInDetails: !!usedInDetails,
    usedInImages: !!usedInImages,
  };
};

const buildUsageConflictMessage = ({ usedInDetails, usedInImages }) => {
  if (usedInDetails && usedInImages) {
    return 'Category is used in Project Details and Project Images';
  }
  if (usedInDetails) {
    return 'Category is used in Project Details';
  }
  return 'Category is used in Project Images';
};

/**
 * Safely toggles the soft-delete flag on a category.
 *
 * Guard is only enforced when marking as deleted (isDelete: false → true).
 * Restoring a deleted category (true → false) skips the usage check.
 *
 * @param {number|string} categoryId
 * @returns {{ success: boolean, statusCode: number, message: string, data?: object }}
 */
const safeToggleCategoryDelete = async (categoryId) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return { success: false, statusCode: 404, message: 'Category not found' };
  }

  if (!category.isDelete) {
    const usage = await checkCategoryUsage(categoryId);
    const isInUse = usage.usedInDetails || usage.usedInImages;

    if (isInUse) {
      return {
        success: false,
        statusCode: 409,
        message: buildUsageConflictMessage(usage),
      };
    }
  }

  category.isDelete = !category.isDelete;
  await category.save();

  return {
    success: true,
    statusCode: 200,
    message: 'Category delete status updated successfully',
    data: category,
  };
};

module.exports = { safeToggleCategoryDelete };
