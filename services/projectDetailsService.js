const ProjectDetails = require('../models/ProjectDetails');
const ProjectDetailsWithImages = require('../models/ProjectDetailsWithImages');

/**
 * Safely toggles the soft-delete flag on a project.
 *
 * Guard is only enforced when marking as deleted (isDelete: false → true).
 * Blocks deletion if the project is referenced in any active ProjectDetailsWithImages record.
 *
 * @param {number|string} projectId
 * @returns {{ success: boolean, statusCode: number, message: string, data?: object }}
 */
const safeToggleProjectDelete = async (projectId) => {
  const project = await ProjectDetails.findByPk(projectId);

  if (!project) {
    return { success: false, statusCode: 404, message: 'Project Details not found' };
  }

  if (!project.isDelete) {
    const linkedImages = await ProjectDetailsWithImages.findOne({
      where: { project_name_id: projectId, isDelete: false },
      attributes: ['id'],
    });

    if (linkedImages) {
      return {
        success: false,
        statusCode: 409,
        message: 'Project is used in Project Images. Please remove the associated project images before deleting.',
      };
    }
  }

  project.isDelete = !project.isDelete;
  await project.save();

  return {
    success: true,
    statusCode: 200,
    message: 'Project Details delete status updated successfully',
    data: project,
  };
};

module.exports = { safeToggleProjectDelete };
