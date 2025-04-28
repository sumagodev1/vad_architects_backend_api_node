const UploadCV = require("../models/UploadCV");
const apiResponse = require("../helper/apiResponse");
const nodemailer = require("nodemailer");

// exports.addUploadCV = async (req, res) => {
//   try {
//     const { name, email, phone, subject, message } = req.body;
//     let newDataVal = req.file ? req.file.path : null;
//     const cv = newDataVal.replace(/\\/g, "/");
//     const uploadCV = await UploadCV.create({
//       name,
//       email,
//       phone,
//       subject,
//       message,
//       cv,
//       isActive: true,
//       isDelete: false,
//     });

//     // Log the CV path for debugging
//     console.log("cv__________", cv);

//     // Return the success response
//     return apiResponse.successResponseWithData(
//       res,
//       "CV uploaded successfully",
//       uploadCV
//     );
//   } catch (error) {
//     console.error("Upload CV failed", error);

//     // if (error.name === "SequelizeUniqueConstraintError") {
//     //   const fields = error.errors.map((err) => err.path);
//     //   let message = "Validation error: ";

//     //   if (fields.includes("email")) {
//     //     message += "Email already exists. ";
//     //   }
//     //   if (fields.includes("phone")) {
//     //     message += "Phone number already exists. ";
//     //   }

//     //   return apiResponse.validationErrorWithData(res, message.trim());
//     // }

//     return apiResponse.ErrorResponse(res, "Upload CV failed");
//   }
// };

exports.addUploadCV = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    let newDataVal = req.file ? req.file.path : null;
    // const cv = newDataVal.replace(/\\/g, "/");
    const cv = process.env.SERVER_PATH + newDataVal.replace(/\\/g, "/");

    const uploadCV = await UploadCV.create({
      name,
      email,
      phone,
      subject,
      // message,
      cv,
      isActive: true,
      isDelete: false,
    });

    console.log("cv__________", cv);

    // Send email notification
    console.log("Calling sendCVEmail...");
    await sendCVEmail(name, email, phone, subject, message, cv);
    console.log("Email function executed successfully.");

    return apiResponse.successResponseWithData(
      res,
      "CV uploaded successfully",
      uploadCV
    );
  } catch (error) {
    console.error("Upload CV failed", error);
    return apiResponse.ErrorResponse(res, "Upload CV failed");
  }
};

const sendCVEmail = async (name, email, phone, subject, cv) => {
  console.log("sendCVEmail function is called with:", name, email, phone, subject, cv);

  try {
    console.log("Creating Gmail transporter...");
    
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      host: process.env.EMAIL_HOST,  
      port: process.env.EMAIL_PORT,  
      secure: process.env.EMAIL_SECURE === "true", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Gmail Transporter created");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_SENT_TO,
      cc:process.env.EMAIL_USER,
      // to: 'vivekpatilss23@gmail.com',
      subject: `New CV Uploaded by ${name}`,
      text: `Dear Admin,\n\n${name} has uploaded a CV. Below are their details:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\nCV: ${cv}\n\nBest regards,\nYour Website`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p><b>Dear Admin,</b></p>
          <p>${name} has uploaded a CV. Below are their details:</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
            <tr style="background-color: #f4f4f4;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Details</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="border: 1px solid #ddd; padding: 8px;">Phone</td>
              <td style="border: 1px solid #ddd; padding: 8px;"><a href="tel:${phone}" style="color: #007BFF; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
              <td style="border: 1px solid #ddd; padding: 8px;"><a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="border: 1px solid #ddd; padding: 8px;">Subject</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${subject}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="border: 1px solid #ddd; padding: 8px;">CV</td>
              <td style="border: 1px solid #ddd; padding: 8px;"><a href="${cv}" target="_blank" style="color: #007BFF; text-decoration: none;">Download CV</a></td>
            </tr>
          </table>
          <br>
          <p style="border-top: 1px solid #ddd; padding-top: 10px;"><b>Best regards,</b><br>Your Website</p>
        </div>`
    };

    console.log("Sending email with options:", mailOptions);
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.updateUploadCV = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, subject, message } = req.body;
    const cv = req.file ? req.file.path : null;

    const uploadCV = await UploadCV.findByPk(id);
    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, "CV not found");
    }

    uploadCV.name = name;
    uploadCV.email = email;
    uploadCV.phone = phone;
    uploadCV.subject = subject;
    uploadCV.message = message;
    uploadCV.cv = cv || uploadCV.cv;
    await uploadCV.save();

    return apiResponse.successResponseWithData(
      res,
      "CV updated successfully",
      uploadCV
    );
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const fields = error.errors.map((err) => err.path);
      let message = "Validation error: ";

      if (fields.includes("email")) {
        message += "Email already exists. ";
      }
      if (fields.includes("phone")) {
        message += "Phone number already exists. ";
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    console.error("Update CV failed", error);
    return apiResponse.ErrorResponse(res, "Update CV failed");
  }
};

exports.getUploadCVs = async (req, res) => {
  try {
    const uploadCVs = await UploadCV.findAll({ where: { isDelete: false } });

    const baseUrl = `${process.env.SERVER_PATH}`;
    const uploadCVsWithBaseUrl = uploadCVs.map((cv) => {
      return {
        ...cv.toJSON(),
        cv: cv.cv ? baseUrl + cv.cv.replace(/\\/g, "/") : null,
      };
    });

    return apiResponse.successResponseWithData(
      res,
      "CVs retrieved successfully",
      uploadCVsWithBaseUrl
    );
  } catch (error) {
    console.error("Get CVs failed", error);
    return apiResponse.ErrorResponse(res, "Get CVs failed");
  }
};

exports.toggleCVStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadCV = await UploadCV.findByPk(id);

    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, "CV not found");
    }

    uploadCV.isActive = !uploadCV.isActive;
    await uploadCV.save();

    return apiResponse.successResponseWithData(
      res,
      "CV status updated successfully",
      uploadCV
    );
  } catch (error) {
    console.error("Toggle CV status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle CV status failed");
  }
};

exports.toggleCVDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadCV = await UploadCV.findByPk(id);

    if (!uploadCV) {
      return apiResponse.notFoundResponse(res, "CV not found");
    }

    uploadCV.isDelete = !uploadCV.isDelete;
    await uploadCV.save();

    return apiResponse.successResponseWithData(
      res,
      "CV delete status updated successfully",
      uploadCV
    );
  } catch (error) {
    console.error("Toggle CV delete status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle CV delete status failed");
  }
};
