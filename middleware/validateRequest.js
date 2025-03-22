// middleware/validateRequest.js
const Joi = require('joi');

// Validation schemas
const schemas = {
  sendOTP: Joi.object({
    phoneNumber: Joi.string().pattern(/^\d{10}$/).required()
      .messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
      })
  }),
  
  verifyOTP: Joi.object({
    phoneNumber: Joi.string().pattern(/^\d{10}$/).required()
      .messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
      }),
    otp: Joi.string().pattern(/^\d{6}$/).required()
      .messages({
        'string.pattern.base': 'OTP must be 6 digits',
        'any.required': 'OTP is required'
      })
  })
};

// Middleware factory function
const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }
    
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};

module.exports = validateRequest;
