import Joi from 'joi';

export const addCartItemValidator = (data) => {
  const schema = Joi.object({
    gameId: Joi.string().trim().lowercase().required().messages({
      'any.required': 'Game ID is required.'
    }),
    quantity: Joi.number().integer().min(1).max(10).default(1),
    platform: Joi.string().trim().allow(null, '').optional(),
    edition: Joi.string().trim().allow(null, '').optional()
  });
  return schema.validate(data, { abortEarly: false });
};

export const updateCartItemValidator = (data) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().min(1).max(10).required().messages({
      'any.required': 'Quantity is required.'
    })
  });
  return schema.validate(data, { abortEarly: false });
};
