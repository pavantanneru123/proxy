// utils/otpUtils.js
const crypto = require('crypto');
const config = require('../config');

// Generate a random OTP of specified length
function generateOTP(length = config.otpLength) {
  const digits = '0123456789';
  let OTP = '';
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  
  return OTP;
}

// Hash the OTP for secure storage
function hashOTP(otp, phone) {
  // Using phone as salt to make the hash unique per user
  return crypto
    .createHash('sha256')
    .update(otp + phone)
    .digest('hex');
}

// Calculate OTP expiry time
function getOTPExpiry() {
  return new Date(Date.now() + config.otpExpiryTime);
}

// Verify if the provided OTP matches the stored hash
function verifyOTP(inputOTP, storedHash, phone) {
  const inputHash = hashOTP(inputOTP, phone);
  return inputHash === storedHash;
}

// Check if OTP is expired
function isOTPExpired(expiryTime) {
  return new Date() > new Date(expiryTime);
}

module.exports = {
  generateOTP,
  hashOTP,
  getOTPExpiry,
  verifyOTP,
  isOTPExpired
};
