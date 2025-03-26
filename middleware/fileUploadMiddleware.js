const multer = require('multer');
const path = require('path');

// Configure storage for image and PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  }
});

// File filter function for image and PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed!'), false); // Reject file
  }
};

// Create multer instance with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Middleware to handle both image and PDF uploads
const uploadFiles = upload.fields([
  { name: 'img', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

module.exports = { uploadFiles };
