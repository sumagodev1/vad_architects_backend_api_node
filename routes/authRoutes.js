const express = require('express');
const { loginUser, changePassword, getProfile, verifyCaptcha, verifyTokenForLocal } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const { validateLogin } = require('../validations/loginvalidation');
const { validateChangePassword } = require('../validations/changePasswordValidation');

const router = express.Router();

router.post('/verify-captcha', verifyCaptcha);
router.post('/login', validateLogin, loginUser);
router.put('/change-password', authenticateToken, validateChangePassword, changePassword);

router.get('/get-profile', authenticateToken, getProfile);
router.get('/verify-token', authenticateToken, verifyTokenForLocal);

router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "Lax" });
    return res.json({ success: true, message: "Logged out successfully" });
});


module.exports = router;
