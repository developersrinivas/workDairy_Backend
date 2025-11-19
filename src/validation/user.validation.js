const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('admin', 'operator').default('operator').messages({
    'any.only': 'Role must be either admin or operator',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

const validateRegister = (req, res, next) => {
  console.log(req.body,"req.body");
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  validateRegister,
  validateLogin,
};
