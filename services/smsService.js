// services/smsService.js
class SMSService {
  constructor() {
    // This is a placeholder for the actual SMS service implementation
    // You'll need to replace this with your chosen SMS provider's SDK
    this.provider = {
      name: 'Placeholder SMS Provider',
      send: this.mockSendSMS
    };
  }
  
  // Mock function for sending SMS (for development/testing)
  async mockSendSMS(phoneNumber, message) {
    console.log(`[MOCK SMS] To: ${phoneNumber}, Message: ${message}`);
    return {
      success: true,
      messageId: `mock-${Date.now()}`
    };
  }
  
  // Actual function to send SMS
  async sendSMS(phoneNumber, message) {
    try {
      // Format phone number if needed (e.g., add country code)
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      // For now, use the mock implementation
      const result = await this.provider.send(formattedNumber, message);
      
      // Log success for debugging
      console.log(`SMS sent to ${phoneNumber} successfully:`, result);
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error(`Failed to send SMS to ${phoneNumber}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Helper to format phone numbers
  formatPhoneNumber(phoneNumber) {
    // Add country code if not present (assuming India +91 for this example)
    if (phoneNumber.length === 10 && !phoneNumber.startsWith('+')) {
      return `+91${phoneNumber}`;
    }
    return phoneNumber;
  }
  
  // Send OTP via SMS
  async sendOTP(phoneNumber, otp) {
    const message = `Your verification code for the Attendance App is: ${otp}. Valid for 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }
}

module.exports = new SMSService();
