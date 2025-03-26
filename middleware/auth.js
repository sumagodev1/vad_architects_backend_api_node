// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
//   if (!token) return res.sendStatus(401); // Unauthorized

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(401); // Forbidden
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;

const jwt = require("jsonwebtoken");
require("dotenv").config();
const apiResponse = require("../helper/apiResponse");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return apiResponse.unauthorizedResponse(res, "Unauthorized: No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return apiResponse.unauthorizedResponse(res, "Unauthorized: Invalid token");
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;

