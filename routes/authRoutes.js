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
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).send({ message: 'Logged out successfully' });
});


module.exports = router;
