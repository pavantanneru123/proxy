// models/studentModel.js
const { pool } = require('../config/database');

class StudentModel {
  // Find a student by phone number
  async findByPhone(phoneNumber) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM student_data WHERE student_phone = ?',
        [phoneNumber]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding student by phone:', error);
      throw error;
    }
  }
  
  // Find a student by ID
  async findById(studentId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM student_data WHERE student_id = ?',
        [studentId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding student by ID:', error);
      throw error;
    }
  }
  
  // Update OTP information for a student
  async updateOtpInfo(studentId, otpHash, otpExpiry) {
    try {
      // Assuming you'll add these columns to your student_data table
      await pool.execute(
        'UPDATE student_data SET otp_hash = ?, otp_expiry = ? WHERE student_id = ?',
        [otpHash, otpExpiry, studentId]
      );
      return true;
    } catch (error) {
      console.error('Error updating OTP info:', error);
      throw error;
    }
  }
}

module.exports = new StudentModel();
