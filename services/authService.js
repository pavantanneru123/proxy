// services/authService.js
const studentModel = require('../models/studentModel');
const smsService = require('./smsService');
const otpUtils = require('../utils/otpUtils');
const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthService {
  // Verify phone number and generate OTP
  async verifyPhoneAndGenerateOTP(phoneNumber) {
    try {
      // Validate phone number format (simple validation)
      if (!this.validatePhoneNumber(phoneNumber)) {
        return {
          success: false,
          message: 'Invalid phone number format'
        };
      }
      
      // Find the student by phone number
      const student = await studentModel.findByPhone(phoneNumber);
      
      // If student not found, return error
      if (!student) {
        return {
          success: false,
          message: 'User not registered'
        };
      }
      
      // Generate a new OTP
      const otp = otpUtils.generateOTP();
      const otpHash = otpUtils.hashOTP(otp, phoneNumber);
      const otpExpiry = otpUtils.getOTPExpiry();
      
      // Store the OTP hash and expiry in the database
      await studentModel.updateOtpInfo(student.student_id, otpHash, otpExpiry);
      
      // Send the OTP via SMS
      const smsSent = await smsService.sendOTP(phoneNumber, otp);
      
      if (!smsSent.success) {
        return {
          success: false,
          message: 'Failed to send OTP'
        };
      }
      
      return {
        success: true,
        message: 'OTP sent successfully',
        studentId: student.student_id
      };
    } catch (error) {
      console.error('Error in verifyPhoneAndGenerateOTP:', error);
      return {
        success: false,
        message: 'Internal server error',
        error: error.message
      };
    }
  }
  
  // Verify OTP and complete login
  async verifyOTPAndLogin(phoneNumber, otp) {
    try {
      // Find the student by phone number
      const student = await studentModel.findByPhone(phoneNumber);
      
      // If student not found, return error
      if (!student) {
        return {
          success: false,
          message: 'User not registered'
        };
      }
      
      // Check if OTP is expired
      if (otpUtils.isOTPExpired(student.otp_expiry)) {
        return {
          success: false,
          message: 'OTP has expired'
        };
      }
      
      // Verify the OTP
      if (!otpUtils.verifyOTP(otp, student.otp_hash, phoneNumber)) {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }
      
      // Generate JWT token
      const token = this.generateToken(student);
      
      // Clear OTP information after successful verification
      await studentModel.updateOtpInfo(student.student_id, null, null);
      
      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          studentId: student.student_id,
          firstName: student.first_name,
          lastName: student.last_name,
          email: student.university_email,
          phone: student.student_phone
        }
      };
    } catch (error) {
      console.error('Error in verifyOTPAndLogin:', error);
      return {
        success: false,
        message: 'Internal server error',
        error: error.message
      };
    }
  }
  
  // Generate JWT token
  generateToken(student) {
    const payload = {
      id: student.student_id,
      phone: student.student_phone,
      email: student.university_email
    };
    
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
  }
  
  // Validate phone number format
  validatePhoneNumber(phone) {
    // Basic validation for a 10-digit phone number
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
}

module.exports = new AuthService();
