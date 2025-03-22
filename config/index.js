// config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  otpExpiryTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  otpLength: 6
};
