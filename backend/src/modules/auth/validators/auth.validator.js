import Joi from 'joi';

const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'Password is required.'
  });

export const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).trim().required().messages({
      'string.alphanum': 'Username must only contain alphanumeric characters.',
      'string.min': 'Username must be at least 3 characters long.'
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address.'
    }),
    password: passwordSchema,
    role: Joi.string().valid('User', 'Admin').default('User')
  });
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ 
      errors: error.details.map(err => ({ field: err.context.key, message: err.message })) 
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address.'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required.'
    })
  });
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ 
      errors: error.details.map(err => ({ field: err.context.key, message: err.message })) 
    });
  }
  next();
};

export const validatePasswordReset = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address.'
    }),
    recoveryKey: Joi.string().required().messages({
      'any.required': 'Recovery key is required.'
    }),
    newPassword: passwordSchema
  });
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ 
      errors: error.details.map(err => ({ field: err.context.key, message: err.message })) 
    });
  }
  next();
};
