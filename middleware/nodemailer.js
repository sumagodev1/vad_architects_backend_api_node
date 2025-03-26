// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_SECURE === 'true', // Ensure secure is a boolean
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   }
// });

// // Middleware to send an email
// const sendEmail = async (req, res, next) => {
//   const { to, subject, text } = req.emailOptions;

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     });

//     console.log('Email sent successfully');
//     next(); // Call next to proceed to the next middleware or controller
//   } catch (error) {
//     console.error('Failed to send email:', error);
//     next(error); // Pass the error to the next middleware
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");
console.log("process.env.EMAIL_USER", process.env.EMAIL_USER);
console.log("process.env.EMAIL_PASS", process.env.EMAIL_PASS);
console.log("process.env.EMAIL_HOST", process.env.EMAIL_HOST);
console.log("process.env.EMAIL_PORT", process.env.EMAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // Ensure secure is a boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // This will skip certificate validation
  },
  
});

// Middleware to send an email and send final response
const sendEmail = async (req, res, next) => {
  const { to, subject, text } = req.emailOptions;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");

    // Send the final response to the client after sending the email
    return res.status(200).json({
      message: "Contact added and email sent successfully",
    });
  } catch (error) {
    console.error("Failed to send email:", error);

    // Send an error response to the client
    return res.status(500).json({
      message: "Contact added, but email failed to send",
    });
  }
};

module.exports = sendEmail;
