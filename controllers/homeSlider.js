const HomeSlider = require("../models/HomeSlider");
const apiResponse = require("../helper/apiResponse");

exports.addHomeSlider = async (req, res) => {
  try {
    if (!req.file) {
      return apiResponse.ErrorResponse(res, "Image is required");
    }

    const { view } = req.body;
    const img = req.file.path;

    const homeSlider = await HomeSlider.create({
      img,
      isActive: true,
      isDelete: false,
      view,
    });
    return apiResponse.successResponseWithData(
      res,
      "HomeSlider added successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Add HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Add HomeSlider failed");
  }
};

exports.updateHomeSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { view } = req.body;

    // Find the existing HomeSlider entry
    const homeSlider = await HomeSlider.findByPk(id);
    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "HomeSlider not found");
    }

    // Check if a new file is uploaded
    if (req.file) {
      homeSlider.img = req.file.path;
    }

    homeSlider.view = view;
    await homeSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Update HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Update HomeSlider failed");
  }
};

exports.getHomeSlider = async (req, res) => {
  try {
    const homeSliders = await HomeSlider.findAll({ where: { isDelete: false } });

    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`;
    console.log("baseUrl", baseUrl);
    
    const homeSlidersWithBaseUrl = homeSliders.map((homeSlider) => ({
      ...homeSlider.toJSON(),
      img: homeSlider.img ? baseUrl + homeSlider.img.replace(/\\/g, "/") : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider retrieved successfully",
      homeSlidersWithBaseUrl
    );
  } catch (error) {
    console.error("Get HomeSlider failed", error);
    return apiResponse.ErrorResponse(res, "Get HomeSlider failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const homeSlider = await HomeSlider.findByPk(id);

    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "homeSlider not found");
    }

    homeSlider.isActive = !homeSlider.isActive;
    await homeSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider status updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Toggle HomeSlider status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle HomeSlider status failed");
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const homeSlider = await HomeSlider.findByPk(id);

    if (!homeSlider) {
      return apiResponse.notFoundResponse(res, "homeSlider not found");
    }

    homeSlider.isDelete = !homeSlider.isDelete;
    await homeSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "HomeSlider delete status updated successfully",
      homeSlider
    );
  } catch (error) {
    console.error("Toggle HomeSlider delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle HomeSlider delete status failed"
    );
  }
};
