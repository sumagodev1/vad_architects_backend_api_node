const Testimonial = require("../models/Testimonial");
const apiResponse = require("../helper/apiResponse");

exports.addTestimonial = async (req, res) => {
  try {
    const { name, experience, company_Name, review, star } = req.body;
    const img = req.file ? req.file.path : null;

    const testimonial = await Testimonial.create({
      img,
      name,
      experience,
      company_Name,
      review,
      star,
      isActive: true,
      isDelete: false,
    });
    return apiResponse.successResponseWithData(
      res,
      "Testimonial added successfully",
      testimonial
    );
  } catch (error) {
    console.error("Add testimonial failed", error);
    return apiResponse.ErrorResponse(res, "Add testimonial failed");
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, star,name,experience,company_Name } = req.body;
    const img = req.file ? req.file.path : null;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    testimonial.img = img || testimonial.img;
    testimonial.name = name;
    testimonial.experience = experience;
    testimonial.company_Name = company_Name;
    testimonial.review = review;
    testimonial.star = star;
    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Update testimonial failed", error);
    return apiResponse.ErrorResponse(res, "Update testimonial failed");
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isDelete: false },
    });

    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`;
        console.log("baseUrl....", baseUrl);
    const testimonialsWithBaseUrl = testimonials.map((testimonial) => {
      console.log("testimonial.img", testimonial.img);
      return {
        ...testimonial.toJSON(), // Convert Sequelize instance to plain object
        img: testimonial.img
          ? baseUrl + testimonial.img.replace(/\\/g, "/")
          : null,
      };
    });

    return apiResponse.successResponseWithData(
      res,
      "Testimonials retrieved successfully",
      testimonialsWithBaseUrl
    );
  } catch (error) {
    console.error("Get testimonials failed", error);
    return apiResponse.ErrorResponse(res, "Get testimonials failed");
  }
};

// exports.isActiveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const testimonial = await Testimonial.findByPk(id);

//     if (!testimonial) {
//       return apiResponse.notFoundResponse(res, "Testimonial not found");
//     }

//     testimonial.isActive = !testimonial.isActive;
//     await testimonial.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Testimonial status updated successfully",
//       testimonial
//     );
//   } catch (error) {
//     console.error("Toggle testimonial status failed", error);
//     return apiResponse.ErrorResponse(res, "Toggle testimonial status failed");
//   }
// };

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    // Count how many featured testimonials are true (is_feature_testimonial = true)
    const totalFeaturedTestimonials = await Testimonial.count({
      where: {
        is_feature_testimonial: true,
        isActive: true,  // Only count the active featured testimonials
      },
    });

    // If there are already 4 active featured testimonials, show the error message
    if (testimonial.is_feature_testimonial && !testimonial.isActive) {
      if (totalFeaturedTestimonials === 4) {
        return apiResponse.validationErrorWithData(
          res,
          "You must first deactivate the previous featured testimonial before activating this one."
        );
      }
    }

    // Toggle the isActive status of the testimonial
    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial status updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Toggle testimonial status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle testimonial status failed");
  }
};


exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    testimonial.isDelete = !testimonial.isDelete;
    await testimonial.save();

    return apiResponse.successResponseWithData(
      res,
      "Testimonial delete status updated successfully",
      testimonial
    );
  } catch (error) {
    console.error("Toggle testimonial delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle testimonial delete status failed"
    );
  }
};

// exports.toggleFeatureTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const testimonial = await Testimonial.findByPk(id);

//     if (!testimonial) {
//       return apiResponse.notFoundResponse(res, "Testimonial not found");
//     }

//     // Toggle the value
//     testimonial.is_feature_testimonial = !testimonial.is_feature_testimonial;
//     await testimonial.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Testimonial feature status updated successfully",
//       testimonial
//     );
//   } catch (error) {
//     console.error("Toggle feature testimonial failed", error);
//     return apiResponse.ErrorResponse(res, "Toggle feature testimonial failed");
//   }
// };

// exports.toggleFeatureTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const testimonial = await Testimonial.findByPk(id);

//     if (!testimonial) {
//       return apiResponse.notFoundResponse(res, "Testimonial not found");
//     }

//     // Check if the testimonial is active and not deleted
//     if (!testimonial.isActive || testimonial.isDelete) {
//       return apiResponse.validationErrorWithData(
//         res,
//         "Testimonial must be active and not deleted to change its feature status."
//       );
//     }

//     // Count how many testimonials have is_feature_testimonial set to true and are active and not deleted
//     const activeTestimonials = await Testimonial.count({
//       where: {
//         is_feature_testimonial: true,
//         isActive: true,  // Ensure the testimonials are active
//         isDelete: false, // Ensure the testimonials are not deleted
//       },
//     });

//     // If there are already 4 testimonials with is_feature_testimonial as true and the current testimonial is not featured
//     if (activeTestimonials >= 4 && !testimonial.is_feature_testimonial) {
//       return apiResponse.validationErrorWithData(
//         res,
//         "Only 4 testimonials can be featured at a time. Please deactivate one to activate another."
//       );
//     }

//     // Toggle the value
//     testimonial.is_feature_testimonial = !testimonial.is_feature_testimonial;
//     await testimonial.save();

//     return apiResponse.successResponseWithData(
//       res,
//       "Testimonial feature status updated successfully",
//       testimonial
//     );
//   } catch (error) {
//     console.error("Toggle feature testimonial failed", error);
//     return apiResponse.ErrorResponse(res, "Error toggling feature status");
//   }
// };

exports.toggleFeatureTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return apiResponse.notFoundResponse(res, "Testimonial not found");
    }

    // If the testimonial is active and not deleted
    if (testimonial.isActive && !testimonial.isDelete) {
      // The logic for when the testimonial is active goes here

      // Count how many testimonials have is_feature_testimonial set to true and are active and not deleted
      const activeTestimonials = await Testimonial.count({
        where: {
          is_feature_testimonial: true,
          isActive: true,  // Ensure the testimonials are active
          isDelete: false, // Ensure the testimonials are not deleted
        },
      });

      // If there are already 4 testimonials with is_feature_testimonial as true and the current testimonial is not featured
      if (activeTestimonials >= 4 && !testimonial.is_feature_testimonial) {
        return apiResponse.validationErrorWithData(
          res,
          "Only 4 testimonials can be featured at a time. Please deactivate one to activate another."
        );
      }

      // Toggle the value of is_feature_testimonial
      testimonial.is_feature_testimonial = !testimonial.is_feature_testimonial;
      await testimonial.save();

      return apiResponse.successResponseWithData(
        res,
        "Testimonial feature status updated successfully",
        testimonial
      );
    } else {
      // Else case: If the testimonial is inactive (isActive = false)
      // Allow the toggle of is_feature_testimonial status even if inactive
      if (testimonial.is_feature_testimonial && !testimonial.isActive) {
        // Allow deactivation of featured status if the testimonial is inactive
        testimonial.is_feature_testimonial = false;
        await testimonial.save();
        return apiResponse.successResponseWithData(
          res,
          "Testimonial feature status deactivated successfully",
          testimonial
        );
      }

      // If the testimonial is inactive but not featured (is_feature_testimonial = false), prevent enabling the feature
      if (!testimonial.is_feature_testimonial && !testimonial.isActive) {
        return apiResponse.validationErrorWithData(
          res,
          "Cannot make an inactive testimonial featured. Please activate the testimonial first."
        );
      }
    }

  } catch (error) {
    console.error("Toggle feature testimonial failed", error);
    return apiResponse.ErrorResponse(res, "Error toggling feature status");
  }
};


