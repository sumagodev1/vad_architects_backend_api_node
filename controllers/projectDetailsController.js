const apiResponse = require('../helper/apiResponse');
const ProjectDetails = require('../models/ProjectDetails')

// exports.addProjectDetails = async (req, res) => {
//   try {
//     const { project_category_id} = req.body;
//     const { project_category, desc } = req.body;
//     // const { project_name_id } = req.body;
//     const { project_name} = req.body;
//     const { project_location} = req.body;
//     const img = req.file ? req.file.path : null;

//     const ProjectDetails1 = await ProjectDetails.create({ img, project_category_id, project_category, project_name, project_location, isActive: true, isDelete: false });
//     return apiResponse.successResponseWithData(res, 'Project Details added successfully', ProjectDetails1);
//   } catch (error) {
//     console.error('Add Project Details failed', error);
//     return apiResponse.ErrorResponse(res, 'Add Project Details failed');
//   }
// };

exports.addProjectDetails = async (req, res) => {
  try {
    const { 
      project_category_id, 
      project_category, 
      project_name, 
      project_location, 
      project_info, 
      project_year_of_completion,  
    } = req.body;

    // project_total_tonnage, 
    // project_status
    
    const img = req.file ? req.file.path : null;

    // Check if the project name already exists in the same category and is active
    const existingActiveProject = await ProjectDetails.findOne({
      where: { 
        project_category, 
        project_name, 
        isDelete: false 
      },
    });

    if (existingActiveProject) {
      return apiResponse.ErrorResponse(res, 'Project Name already exists in this category');
    }

    // Check if the project name exists in the same category but is deleted (isDelete: true)
    const existingDeletedProject = await ProjectDetails.findOne({
      where: { 
        project_category, 
        project_name, 
        isDelete: true 
      },
    });

    if (existingDeletedProject) {
      // If the project was deleted, we can create a new record with the same project_name
      console.log('Found a deleted project. A new record will be created with the same project_name.');
    }

    // Create the new project record
    const newProject = await ProjectDetails.create({
      img,
      project_category_id,
      project_category,
      project_name,
      project_location,
      project_info,
      project_year_of_completion,
      // project_total_tonnage,
      // project_status,
      isActive: true,
      isDelete: false,  // New record is active
    });

    return apiResponse.successResponseWithData(res, 'Project Details added successfully', newProject);
  } catch (error) {
    console.error('Add Project Details failed', error);
    return apiResponse.ErrorResponse(res, 'Add Project Details failed');
  }
};


// exports.updateProjectDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { project_category_id } = req.body;
//     const { project_category, desc } = req.body;
//     // const { project_name_id } = req.body;
//     const { project_name} = req.body;
//     const { project_location} = req.body;
//     const img = req.file ? req.file.path : null;

//     const ProjectDetails1 = await ProjectDetails.findByPk(id);
//     if (!ProjectDetails1) {
//       return apiResponse.notFoundResponse(res, 'Project Details not found');
//     }

//     ProjectDetails1.img = img || ProjectDetails1.img;
//     ProjectDetails1.project_category_id = project_category_id;
//     ProjectDetails1.project_category = project_category;
//     // ProjectDetails1.project_name_id = project_name_id;
//     ProjectDetails1.project_name = project_name;
//     ProjectDetails1.project_location = project_location;
//     await ProjectDetails1.save();

//     return apiResponse.successResponseWithData(res, 'Project Details updated successfully', ProjectDetails1);
//   } catch (error) {
//     console.error('Update Project Details failed', error);
//     return apiResponse.ErrorResponse(res, 'Update Project Details failed');
//   }
// };

const { Op } = require("sequelize");

// exports.updateProjectDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { project_category_id, project_category, project_name, project_location, project_info, project_year_of_completion, project_total_tonnage, project_status } = req.body;
//     const img = req.file ? req.file.path : null;

//     // Find the existing project
//     const projectToUpdate = await ProjectDetails.findByPk(id);
//     if (!projectToUpdate) {
//       return apiResponse.notFoundResponse(res, "Project Details not found");
//     }

//     // Check if another project (EXCLUDING the one being updated) has the same project_name in the same category
//     const duplicateProject = await ProjectDetails.findOne({
//       where: {
//         project_category,
//         project_name,
//         isDelete: false,
//         id: { [Op.ne]: id }, // Exclude the current project
//       },
//     });

//     if (duplicateProject) {
//       return apiResponse.ErrorResponse(res, "Another project with this name already exists in this category");
//     }

//     // If no duplicate found, allow updating the existing record
//     projectToUpdate.img = img || projectToUpdate.img;
//     projectToUpdate.project_category_id = project_category_id;
//     projectToUpdate.project_category = project_category;
//     projectToUpdate.project_name = project_name;
//     projectToUpdate.project_location = project_location;

//     projectToUpdate.project_info = project_info;
//     projectToUpdate.project_year_of_completion = project_year_of_completion;
//     projectToUpdate.project_total_tonnage = project_total_tonnage;
//     projectToUpdate.project_status = project_status;

//     await projectToUpdate.save();

//     return apiResponse.successResponseWithData(res, "Project Details updated successfully", projectToUpdate);
//   } catch (error) {
//     console.error("Update Project Details failed", error);
//     return apiResponse.ErrorResponse(res, "Update Project Details failed");
//   }
// };

const sequelize = require('../config/database'); // Import the sequelize instance
const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");

exports.updateProjectDetails = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params;
    const { project_category_id, project_category, project_name, project_location, project_info, project_year_of_completion } = req.body;
    // project_total_tonnage, project_status

    const img = req.file ? req.file.path : null;

    // Find the existing project
    const projectToUpdate = await ProjectDetails.findByPk(id);
    if (!projectToUpdate) {
      return apiResponse.notFoundResponse(res, "Project Details not found");
    }

    // Check if another project (EXCLUDING the one being updated) has the same project_name in the same category
    const duplicateProject = await ProjectDetails.findOne({
      where: {
        project_category,
        project_name,
        isDelete: false,
        id: { [Op.ne]: id }, // Exclude the current project
      },
    });

    if (duplicateProject) {
      return apiResponse.ErrorResponse(res, "Another project with this name already exists in this category");
    }

    // If no duplicate found, allow updating the existing record
    projectToUpdate.img = img || projectToUpdate.img;
    projectToUpdate.project_category_id = project_category_id;
    projectToUpdate.project_category = project_category;
    projectToUpdate.project_name = project_name;
    projectToUpdate.project_location = project_location;

    projectToUpdate.project_info = project_info;
    projectToUpdate.project_year_of_completion = project_year_of_completion;
    // projectToUpdate.project_total_tonnage = project_total_tonnage;
    // projectToUpdate.project_status = project_status;

    await projectToUpdate.save({ transaction }); // Save the updated project

    // Update the ProjectDetailsWithImages table where project_name_id matches the id
    await ProjectDetailsWithImages.update(
      { project_name: project_name, project_category:project_category, project_category_id:project_category_id }, // Update project_name in ProjectDetailsWithImages table
      { where: { project_name_id: id }, transaction }
    );

    await transaction.commit(); // Commit transaction if everything is successful

    return apiResponse.successResponseWithData(res, "Project Details updated successfully", projectToUpdate);
  } catch (error) {
    await transaction.rollback(); // Rollback in case of error
    console.error("Update Project Details failed", error);
    return apiResponse.ErrorResponse(res, "Update Project Details failed");
  }
};


exports.getProjectDetails = async (req, res) => {
  try {
    const ProjectDetails1 = await ProjectDetails.findAll({ where: { isDelete: false } });
    
    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`; // Adjust according to your setup
    console.log("baseUrl....", baseUrl);
    const projectDetailsWithBaseUrl = ProjectDetails1.map(ProjectDetails1 => {
      console.log("Project Details.img", ProjectDetails1.img);
      return {
        ...ProjectDetails1.toJSON(), // Convert Sequelize instance to plain object
        img: ProjectDetails1.img ? baseUrl + ProjectDetails1.img.replace(/\\/g, '/') : null 
      };
    });

    return apiResponse.successResponseWithData(res, 'Project Details retrieved successfully', projectDetailsWithBaseUrl);
  } catch (error) {
    console.error('Get Project Details failed', error);
    return apiResponse.ErrorResponse(res, 'Get Project Details failed');
  }
};

// exports.isActiveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ProjectDetails1 = await ProjectDetails.findByPk(id);

//     if (!ProjectDetails1) {
//       return apiResponse.notFoundResponse(res, 'Project Details not found');
//     }

//     ProjectDetails1.isActive = !ProjectDetails1.isActive;
//     await ProjectDetails1.save();

//     return apiResponse.successResponseWithData(res, 'Project Details status updated successfully', ProjectDetails1);
//   } catch (error) {
//     console.error('Toggle Project Details status failed', error);
//     return apiResponse.ErrorResponse(res, 'Toggle Project Details status failed');
//   }
// };

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ProjectDetails1 = await ProjectDetails.findByPk(id);

    if (!ProjectDetails1) {
      return apiResponse.notFoundResponse(res, 'Project Details not found');
    }

    // Check if the project is currently active and will be deactivated
    const willBeDeactivated = ProjectDetails1.isActive === true;

    // Toggle the isActive status
    ProjectDetails1.isActive = !ProjectDetails1.isActive;

    // If it's being deactivated, also set is_feature_project to false
    if (willBeDeactivated) {
      ProjectDetails1.is_feature_project = false;
    }

    await ProjectDetails1.save();

    return apiResponse.successResponseWithData(
      res,
      'Project Details status updated successfully',
      ProjectDetails1
    );
  } catch (error) {
    console.error('Toggle Project Details status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle Project Details status failed');
  }
};


exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ProjectDetails1 = await ProjectDetails.findByPk(id);

    if (!ProjectDetails1) {
      return apiResponse.notFoundResponse(res, 'Project Details not found');
    }

    ProjectDetails1.isDelete = !ProjectDetails1.isDelete;
    await ProjectDetails1.save();

    return apiResponse.successResponseWithData(res, 'Project Details delete status updated successfully', ProjectDetails1);
  } catch (error) {
    console.error('Toggle Project Details delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle Project Details delete status failed');
  }
};

exports.toggleFeatureProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectDetails.findByPk(id);

    if (!project) {
      return apiResponse.notFoundResponse(res, "Project not found");
    }

    // If the project is active and not deleted
    if (project.isActive && !project.isDelete) {
      // The logic for when the project is active goes here

      // Count how many projects have is_feature_project set to true and are active and not deleted
      const activeprojects = await ProjectDetails.count({
        where: {
          is_feature_project: true,
          isActive: true,  // Ensure the projects are active
          isDelete: false, // Ensure the projects are not deleted
        },
      });

      // If there are already 4 projects with is_feature_project as true and the current project is not featured
      if (activeprojects >= 4 && !project.is_feature_project) {
        return apiResponse.validationErrorWithData(
          res,
          "Only 4 projects can be featured at a time. Please deactivate one to activate another."
        );
      }

      // Toggle the value of is_feature_project
      project.is_feature_project = !project.is_feature_project;
      await project.save();

      return apiResponse.successResponseWithData(
        res,
        "Project feature status updated successfully",
        project
      );
    } else {
      // Else case: If the project is inactive (isActive = false)
      // Allow the toggle of is_feature_project status even if inactive
      if (project.is_feature_project && !project.isActive) {
        // Allow deactivation of featured status if the project is inactive
        project.is_feature_project = false;
        await project.save();
        return apiResponse.successResponseWithData(
          res,
          "Project feature status deactivated successfully",
          project
        );
      }

      // If the project is inactive but not featured (is_feature_project = false), prevent enabling the feature
      if (!project.is_feature_project && !project.isActive) {
        return apiResponse.validationErrorWithData(
          res,
          "Cannot make an inactive project featured. Please activate the project first."
        );
      }
    }

  } catch (error) {
    console.error("Toggle feature project failed", error);
    return apiResponse.ErrorResponse(res, "Error toggling feature status");
  }
};
