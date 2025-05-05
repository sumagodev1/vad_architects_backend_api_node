// const apiResponse = require("../helper/apiResponse");
// const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");

// exports.addProjectDetailsWithImages = async (req, res) => {
//   try {
//     // const imgs = req.files ? req.files.map((file) => file.path) : [];
//     const imgs = req.files ? req.files.map((file) => file.path.replace(/\\/g, "/")) : [];

//     const { project_category_id } = req.body;
//     const { project_category, desc } = req.body;
//     const { project_name_id } = req.body;
//     const { project_name } = req.body;
//     const { project_location } = req.body;
//     const { project_info } = req.body;
//     const { project_year_of_completion } = req.body;
//     const { project_total_tonnage } = req.body;
//     const { project_status } = req.body;

//     const ProjectDetailsWithImages1 = await ProjectDetailsWithImages.create({
//       imgs,
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//       project_location,
//       project_info,
//       project_year_of_completion,
//       project_total_tonnage,
//       project_status,
//       isActive: true,
//       isDelete: false,
//     });
//     return apiResponse.successResponseWithData(
//       res,
//       "Project Details added successfully",
//       ProjectDetailsWithImages1
//     );
//   } catch (error) {
//     console.error("Add Project Details failed", error);
//     return apiResponse.ErrorResponse(res, "Add Project Details failed");
//   }
// };

// exports.updateProjectDetailsWithImages = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const project = await ProjectDetailsWithImages.findByPk(id);

//       if (!project) {
//         return apiResponse.notFoundResponse(res, "Project Details not found");
//       }

//       // Collect multiple image paths
//     //   const imgs = req.files ? req.files.map((file) => file.path) : project.imgs;
//     const imgs = req.files ? req.files.map((file) => file.path.replace(/\\/g, "/")) : project.imgs;

//       const {
//         project_category_id,
//         project_category,
//         project_name_id,
//         project_name,
//         project_location,
//         project_info,
//         project_year_of_completion,
//         project_total_tonnage,
//         project_status
//       } = req.body;

//       await project.update({
//         imgs,
//         project_category_id,
//         project_category,
//         project_name_id,
//         project_name,
//         project_location,
//         project_info,
//         project_year_of_completion,
//         project_total_tonnage,
//         project_status,
//       });

//       return apiResponse.successResponseWithData(res, "Project Details updated successfully", project);
//     } catch (error) {
//       console.error("Update Project Details failed", error);
//       return apiResponse.ErrorResponse(res, "Update Project Details failed");
//     }
//   };

//   exports.getProjectDetailsWithImages = async (req, res) => {
//     try {
//       const ProjectDetailsWithImages1 = await ProjectDetailsWithImages.findAll({
//         where: { isDelete: false },
//       });

//       // Base URL for images
//       const baseUrl = `${process.env.SERVER_PATH}`; // Adjust according to your setup

//       const ProjectDetailsWithImagesWithBaseUrl = ProjectDetailsWithImages1.map(
//         (project) => {
//           const imgs = Array.isArray(project.imgs) ? project.imgs : JSON.parse(project.imgs || '[]');

//           return {
//             ...project.toJSON(), // Convert Sequelize instance to plain object
//             imgs: imgs.map((imgPath) => baseUrl + imgPath.replace(/\\/g, "/")),
//           };
//         }
//       );

//       return apiResponse.successResponseWithData(
//         res,
//         "Project Details retrieved successfully",
//         ProjectDetailsWithImagesWithBaseUrl
//       );
//     } catch (error) {
//       console.error("Get Project Details failed", error);
//       return apiResponse.ErrorResponse(res, "Get Project Details failed");
//     }
//   };

// exports.isActiveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ProjectDetailsWithImages1 = await ProjectDetailsWithImages.findByPk(
//       id
//     );

//     if (!ProjectDetailsWithImages1) {
//       return apiResponse.notFoundResponse(res, "Project Details not found");
//     }

//     ProjectDetailsWithImages1.isActive = !ProjectDetailsWithImages1.isActive;
//     await ProjectDetailsWithImages1.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Project Details status updated successfully",
//       ProjectDetailsWithImages1
//     );
//   } catch (error) {
//     console.error("Toggle Project Details status failed", error);
//     return apiResponse.ErrorResponse(
//       res,
//       "Toggle Project Details status failed"
//     );
//   }
// };

// exports.isDeleteStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ProjectDetailsWithImages1 = await ProjectDetailsWithImages.findByPk(
//       id
//     );

//     if (!ProjectDetailsWithImages1) {
//       return apiResponse.notFoundResponse(res, "Project Details not found");
//     }

//     ProjectDetailsWithImages1.isDelete = !ProjectDetailsWithImages1.isDelete;
//     await ProjectDetailsWithImages1.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Project Details delete status updated successfully",
//       ProjectDetailsWithImages1
//     );
//   } catch (error) {
//     console.error("Toggle Project Details delete status failed", error);
//     return apiResponse.ErrorResponse(
//       res,
//       "Toggle Project Details delete status failed"
//     );
//   }
// };

const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");
const fs = require("fs");
const path = require("path");
// Upload multiple images

// const createProject = async (req, res) => {
//   try {
//     const {
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//     } = req.body;

//     // Get image file paths
//     // const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
//     const imagePaths = req.files.map((file) => `uploads/projectDetailsWithImages/${file.filename}`);

//     // Create project entry in the database
//     const project = await ProjectDetailsWithImages.create({
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//       // project_location,
//       // project_info,
//       // project_year_of_completion,
//       // project_total_tonnage,
//       // project_status,
//       project_images: imagePaths,
//     });

//     res.status(201).json({ message: "Project created successfully!", project });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createProject = async (req, res) => {
//   try {
//     const {
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//     } = req.body;

//     // Get image file paths
//     const imagePaths = req.files.map((file) => `uploads/projectDetailsWithImages/${file.filename}`);

//     // Check if the project name already exists in the same category and is not deleted
//     const existingProject = await ProjectDetailsWithImages.findOne({
//       where: {
//         project_category,
//         project_name,
//         isDelete: false,  // Ensure that it is not a deleted project
//       },
//     });

//     if (existingProject) {
//       return res.status(400).json({
//         message: `Project with the name "${project_name}" already exists for this category.`,
//       });
//     }

//     // Create a new project entry in the database
//     const project = await ProjectDetailsWithImages.create({
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//       project_images: imagePaths,
//     });

//     res.status(201).json({ message: "Project created successfully!", project });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createProject = async (req, res) => {
  try {
    const {
      project_category_id,
      project_category,
      project_name_id,
      project_name,
      before_description,
      planning_description,
      after_description,
      detailed_description,
      client_name,
      client_designation,
      client_review,
      star,
    } = req.body;

    // Get the `before_img` file path if uploaded
    let beforeImgPath = null;
    if (req.files["before_img"] && req.files["before_img"].length > 0) {
      beforeImgPath = `uploads/projectDetailsWithImages/${req.files["before_img"][0].filename}`;
    }

    let planningImgPath = null;
    if (req.files["planning_img"] && req.files["planning_img"].length > 0) {
      planningImgPath = `uploads/projectDetailsWithImages/${req.files["planning_img"][0].filename}`;
    }

    let afterImgPath = null;
    if (req.files["after_img"] && req.files["after_img"].length > 0) {
      afterImgPath = `uploads/projectDetailsWithImages/${req.files["after_img"][0].filename}`;
    }

    // Get multiple `project_images` file paths
    const imagePaths = req.files["project_images"]
      ? req.files["project_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    let clientImgPath = null;
    if (req.files["client_img"] && req.files["client_img"].length > 0) {
      clientImgPath = `uploads/projectDetailsWithImages/${req.files["client_img"][0].filename}`;
    }

    let heroImgPath = null;
    if (req.files["hero_img"] && req.files["hero_img"].length > 0) {
      heroImgPath = `uploads/projectDetailsWithImages/${req.files["hero_img"][0].filename}`;
    }

    // Check if the project name already exists in the same category and is not deleted
    const existingProject = await ProjectDetailsWithImages.findOne({
      where: {
        project_category,
        project_name,
        isDelete: false, // Ensure that it is not a deleted project
      },
    });

    if (existingProject) {
      return res.status(400).json({
        message: `Project with the name "${project_name}" already exists for this category.`,
      });
    }

    // Create a new project entry in the database
    const project = await ProjectDetailsWithImages.create({
      project_category_id,
      project_category,
      project_name_id,
      project_name,
      before_description,
      planning_description,
      after_description,
      detailed_description,
      before_img: beforeImgPath,  // Store the before image path
      planning_img: planningImgPath, 
      after_img: afterImgPath, 
      project_images: imagePaths, // Store multiple images

      client_name,
      client_designation,
      client_review,
      star,
      client_img: clientImgPath,
      hero_img: heroImgPath
    });

    res.status(201).json({ message: "Project created successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectDetailsWithImages.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Extract fields from request body
    const {
      project_category_id,
      project_category,
      project_name_id,
      project_name,
      before_description,
      planning_description,
      after_description,
      detailed_description,
      client_name,
      client_designation,
      client_review,
      star,
    } = req.body;

    // Check if another project in the same category has the same name and is not deleted
    if (project_name) {
      const existingProject = await ProjectDetailsWithImages.findOne({
        where: {
          project_category,
          project_name,
          isDelete: false, // Ensure the project is not deleted
        },
      });

      if (existingProject && existingProject.id !== parseInt(id)) {
        return res.status(400).json({
          message: `Project with the name '${project_name}' already exists in this category.`,
        });
      }
    }

    // Handle `before_img` update if a new file is uploaded
    let beforeImgPath = project.before_img; // Keep existing before image by default
    if (req.files["before_img"] && req.files["before_img"].length > 0) {
      beforeImgPath = `uploads/projectDetailsWithImages/${req.files["before_img"][0].filename}`;
    }

    // Handle `planning_img` update if a new file is uploaded
    let planningImgPath = project.planning_img; // Keep existing before image by default
    if (req.files["planning_img"] && req.files["planning_img"].length > 0) {
      planningImgPath = `uploads/projectDetailsWithImages/${req.files["planning_img"][0].filename}`;
    }

    // Handle `after_img` update if a new file is uploaded
    let afterImgPath = project.after_img; // Keep existing before image by default
    if (req.files["after_img"] && req.files["after_img"].length > 0) {
      afterImgPath = `uploads/projectDetailsWithImages/${req.files["after_img"][0].filename}`;
    }

        // Handle `after_img` update if a new file is uploaded
        let clientImgPath = project.client_img; // Keep existing before image by default
        if (req.files["client_img"] && req.files["client_img"].length > 0) {
          clientImgPath = `uploads/projectDetailsWithImages/${req.files["client_img"][0].filename}`;
        }

        let heroImgPath = project.hero_img; // Keep existing hero image by default
        if (req.files["hero_img"] && req.files["hero_img"].length > 0) {
          heroImgPath = `uploads/projectDetailsWithImages/${req.files["hero_img"][0].filename}`;
        }

    // Parse existing images properly (ensure it's always an array)
    let existingImages = project.project_images;
    if (typeof existingImages === "string") {
      existingImages = JSON.parse(existingImages); // Fix for string issue
    }
    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }

    // Get new image paths from uploaded files
    const newImages = req.files["project_images"]
      ? req.files["project_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const updatedImages = [...existingImages, ...newImages];

    // Update project fields
    project.project_category_id = project_category_id || project.project_category_id;
    project.project_category = project_category || project.project_category;
    project.project_name_id = project_name_id || project.project_name_id;
    project.project_name = project_name || project.project_name;
    project.before_description = before_description || project.before_description;
    project.planning_description = planning_description || project.planning_description;
    project.after_description = after_description || project.after_description;
    project.detailed_description = detailed_description || project.detailed_description;
    project.before_img = beforeImgPath;
    project.planning_img = planningImgPath;
    project.after_img = afterImgPath;
    project.project_images = updatedImages;

    project.client_name = client_name || project.client_name;
    project.client_designation = client_designation || project.client_designation;
    project.client_review = client_review || project.client_review;
    project.star = star || project.star;
    project.client_img = clientImgPath;
    project.hero_img = heroImgPath;

    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectDetailsWithImages.findAll({ where: { isDelete: false } });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    // const { id } = req.params;
    // const project = await ProjectDetailsWithImages.findByPk(id);

    const { project_name_id  } = req.params; // Get project_name_id  from request parameters
    // const project = await ProjectDetailsWithImages.findOne({
      const projects = await ProjectDetailsWithImages.findAll({
      where: { project_name_id, isDelete: false, isActive: false  },  // Query by project_name_id 
    });


    // if (!projects) {
    //   return res.status(404).json({ message: "Project not found" });
    // }
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No active project found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateIsActive = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isActive } = req.body;

    const project = await ProjectDetailsWithImages.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isActive = !project.isActive; // Update isActive status
    await project.save();

    res
      .status(200)
      .json({ message: "isActive status updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateProjectImages = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await ProjectDetailsWithImages.findByPk(id);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Extract fields from request body
//     const {
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//     } = req.body;

//     // Check if another project in the same category has the same name and is not deleted
//     if (project_name) {
//       const existingProject = await ProjectDetailsWithImages.findOne({
//         where: {
//           project_category_id,
//           project_name,
//           isDelete: false, // Ensure the project is not deleted
//         },
//       });

//       if (existingProject && existingProject.id !== parseInt(id)) {
//         return res.status(400).json({
//           message: `Project with the name '${project_name}' already exists in this category.`,
//         });
//       }
//     }

//     // Parse existing images properly (ensure it's always an array)
//     let existingImages = project.project_images;
//     if (typeof existingImages === "string") {
//       existingImages = JSON.parse(existingImages); // Fix for string issue
//     }
//     if (!Array.isArray(existingImages)) {
//       existingImages = [];
//     }

//     // Get new image paths from uploaded files
//     let newImages = req.files ? req.files.map((file) => `uploads/projectDetailsWithImages/${file.filename}`) : [];

//     // Merge old and new images
//     const updatedImages = [...existingImages, ...newImages];

//     // Update project fields
//     project.project_category_id = project_category_id || project.project_category_id;
//     project.project_category = project_category || project.project_category;
//     project.project_name_id = project_name_id || project.project_name_id;
//     project.project_name = project_name || project.project_name;
//     project.project_images = updatedImages;

//     // Save the updated project
//     await project.save();

//     res.status(200).json({ message: "Project updated successfully", project });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const updateProjectImages = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const project = await ProjectDetailsWithImages.findByPk(id);
  
//       if (!project) {
//         return res.status(404).json({ message: "Project not found" });
//       }
  
//       // Parse existing images properly (ensure it's always an array)
//       let existingImages = project.project_images;
//       if (typeof existingImages === "string") {
//         existingImages = JSON.parse(existingImages); // Fix for string issue
//       }
//       if (!Array.isArray(existingImages)) {
//         existingImages = [];
//       }
  
//       // Get new image paths from uploaded files
//       let newImages = req.files.map((file) => `uploads/projectDetailsWithImages/${file.filename}`);
  
//       // Merge old and new images
//       const updatedImages = [...existingImages, ...newImages];
  
//       // Save updated images as a JSON string
//       project.project_images = updatedImages;
//       await project.save();
  
//       res.status(200).json({ message: "Images updated successfully", project });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
  
// const updateProjectImages = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const project = await ProjectDetailsWithImages.findByPk(id);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Extract fields from request body
//     const {
//       project_category_id,
//       project_category,
//       project_name_id,
//       project_name,
//     } = req.body;

//     // Parse existing images properly (ensure it's always an array)
//     let existingImages = project.project_images;
//     if (typeof existingImages === "string") {
//       existingImages = JSON.parse(existingImages); // Fix for string issue
//     }
//     if (!Array.isArray(existingImages)) {
//       existingImages = [];
//     }

//     // Get new image paths from uploaded files
//     let newImages = req.files ? req.files.map((file) => `uploads/projectDetailsWithImages/${file.filename}`) : [];

//     // Merge old and new images
//     const updatedImages = [...existingImages, ...newImages];

//     // Update project fields
//     project.project_category_id = project_category_id || project.project_category_id;
//     project.project_category = project_category || project.project_category;
//     project.project_name_id = project_name_id || project.project_name_id;
//     project.project_name = project_name || project.project_name;
    
//     project.project_images = updatedImages;

//     await project.save();

//     res.status(200).json({ message: "Project updated successfully", project });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
  
  const deleteProjectImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithImages.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.project_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.project_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update isDelete status
const updateIsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isDelete } = req.body;

    const project = await ProjectDetailsWithImages.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isDelete = !project.isDelete;  // Update isDelete status
    await project.save();

    res
      .status(200)
      .json({ message: "isDelete status updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateIsActive,
  updateIsDelete,deleteProjectImage,updateProjectImages
};
