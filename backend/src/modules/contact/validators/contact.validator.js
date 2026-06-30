import Joi from 'joi';

export const submitContactValidator = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(1).max(50).required().messages({
      'string.empty': 'First name is required.',
      'any.required': 'First name is required.'
    }),
    lastName: Joi.string().trim().min(1).max(50).required().messages({
      'string.empty': 'Last name is required.',
      'any.required': 'Last name is required.'
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.'
    }),
    message: Joi.string().trim().min(10).max(2000).required().messages({
      'string.min': 'Message must be at least 10 characters.',
      'string.max': 'Message cannot exceed 2000 characters.',
      'any.required': 'Message is required.'
    })
  });
  return schema.validate(data, { abortEarly: false });
};
