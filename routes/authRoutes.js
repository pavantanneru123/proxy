// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

// Route for sending OTP
router.post(
  '/send-otp',
  validateRequest('sendOTP'),
  authController.sendOTP
);

// Route for verifying OTP
router.post(
  '/verify-otp',
  validateRequest('verifyOTP'),
  authController.verifyOTP
);

module.exports = router;
