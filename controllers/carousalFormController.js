const Contact = require('../models/CarousalForms');
const apiResponse = require('../helper/apiResponse');
const nodemailer = require('nodemailer');

// exports.addContact = async (req, res) => {
//   try {
//     const { name, email, mobile, message } = req.body;

//     // Create the new contact in the database
//     const contact = await Contact.create({ name, email, mobile, message });

//     // Return success response
//     return apiResponse.successResponseWithData(res, 'Contact added successfully', contact);
//   } catch (error) {
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       const fields = error.errors.map((err) => err.path);
//       let message = 'Validation error: ';

//       if (fields.includes('email')) {
//         message += 'Email already exists. ';
//       }
//       if (fields.includes('mobile')) {
//         message += 'Mobile number already exists.';
//       }

//       return apiResponse.validationErrorWithData(res, message.trim());
//     }

//     console.error('Add contact failed', error);
//     return apiResponse.ErrorResponse(res, 'Add contact failed');
//   }
// };

// exports.addContact = async (req, res) => {
//   try {
//     const { name, email, mobile, message } = req.body;

//     // Create the new contact in the database
//     const contact = await Contact.create({ name, email, mobile, message });

//     // Return success response
//     return apiResponse.successResponseWithData(res, 'Contact added successfully', contact);
//   } catch (error) {
//     console.error('Add contact failed', error);
//     return apiResponse.ErrorResponse(res, 'Add contact failed');
//   }
// };

exports.addContact = async (req, res) => {  
  try {
    const { name, email, mobile, message } = req.body;

    console.log("Received contact form data:", req.body);

    // Validate input
    if (!name || !email || !mobile || !message) {
      console.error("Missing required fields");
      return apiResponse.ErrorResponse(res, "All fields are required");
    }

    // Save contact in the database
    const contact = await Contact.create({ name, email, mobile, message });
    console.log("Contact saved to DB:", contact);

    // Send confirmation email
    console.log("Calling sendEmailToUser...");
    await sendEmailToUser(email, name, mobile, message);
    console.log("Email function executed successfully.");

    return apiResponse.successResponseWithData(res, 'Contact added successfully', contact);
  } catch (error) {
    console.error("Add contact failed:", error);
    return apiResponse.ErrorResponse(res, "Add contact failed");
  }
};

const sendEmailToUser = async (email, name, mobile, message) => {
  console.log("sendEmailToUser function is called with:", email, name, mobile, message);

  try {
    console.log("Creating Gmail transporter...");
    
    // Use Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("Gmail Transporter created");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_SENT_TO,
      cc:process.env.EMAIL_USER,
      subject: `${name} wants to contact you`,
      text: `Dear Admin,\n\n${name} wants to contact you. Below are their details:\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nMessage: ${message}\n\nBest regards,\nModArchSteel`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p><b>Dear Admin,</b></p>
          <p>${name} wants to contact you. Below are their details:</p>
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
              <td style="border: 1px solid #ddd; padding: 8px;">Mobile</td>
              <td style="border: 1px solid #ddd; padding: 8px;"><a href="tel:${mobile}" style="color: #007BFF; text-decoration: none;">${mobile}</a></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
              <td style="border: 1px solid #ddd; padding: 8px;"><a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="border: 1px solid #ddd; padding: 8px;">Message</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${message}</td>
            </tr>
          </table>
          <br>
          <p style="border-top: 1px solid #ddd; padding-top: 10px;"><b>Best regards,</b><br>ModArchSteel</p>
        </div>`
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send email to the person who filled the form
// const sendEmailToUser = async (email, name, mobile, message) => {
//   console.log("sendEmailToUser function is called with:", email, name, mobile, message);

//   try {
//     console.log("Creating Gmail transporter...");
    
//     // Use Nodemailer with Gmail
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         // user: 'modarchsteel@gmail.com',  
//         // pass: 'hqui zpab myrz sujl'
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     console.log("Gmail Transporter created");

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER,
//       subject: 'Thank You for Contacting Us!',
//       text: `Dear Admin,\n\n${name} wants to contact you. Below are their details:\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nMessage: ${message}\n\nBest regards,\nYour Company`,
//       html: `<b>Dear Admin,</b><br><br>${name} wants to contact you. Below are their details :<br><br>Name: ${name}<br><br><b>Best regards,</b><br>Your Company`
//     };

//     console.log("Sending email with options:", mailOptions);

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully:", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };


exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ where: { isDelete: false } });
    return apiResponse.successResponseWithData(res, 'Contacts retrieved successfully', contacts);
  } catch (error) {
    console.error('Get contacts failed', error);
    return apiResponse.ErrorResponse(res, 'Get contacts failed');
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, message } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return apiResponse.notFoundResponse(res, 'Contact not found');
    }

    contact.name = name;
    contact.email = email;
    contact.mobile = mobile;
    contact.message = message;

    await contact.save();
    return apiResponse.successResponseWithData(res, 'Contact updated successfully', contact);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const fields = error.errors.map((err) => err.path);
      let message = 'Validation error: ';

      if (fields.includes('email')) {
        message += 'Email already exists. ';
      }
      if (fields.includes('mobile')) {
        message += 'Mobile number already exists.';
      }

      return apiResponse.validationErrorWithData(res, message.trim());
    }

    console.error('Update contact failed', error);
    return apiResponse.ErrorResponse(res, 'Update contact failed');
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return apiResponse.notFoundResponse(res, 'Contact not found');
    }

    contact.isDelete = true;
    await contact.save();

    return apiResponse.successResponseWithData(res, 'Contact deleted successfully', contact);
  } catch (error) {
    console.error('Delete contact failed', error);
    return apiResponse.ErrorResponse(res, 'Delete contact failed');
  }
};
