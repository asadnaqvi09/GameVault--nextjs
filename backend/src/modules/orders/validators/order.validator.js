import Joi from 'joi';
import { ORDER_STATUS } from '../../../shared/constants/order.constants.js';

const billingSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  email: Joi.string().email().lowercase().trim().required(),
  province: Joi.string().trim().min(1).max(80).required(),
  city: Joi.string().trim().min(1).max(80).required(),
  streetAddress: Joi.string().trim().min(1).max(200).required(),
  zipCode: Joi.string().trim().min(1).max(20).required(),
  orderNotes: Joi.string().trim().max(500).allow('').optional(),
});

const itemSchema = Joi.object({
  gameId: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).max(10).default(1),
  platform: Joi.string().trim().max(50).allow('', null).optional(),
  edition: Joi.string().trim().max(50).allow('', null).optional(),
});

export const createOrderValidator = (data) => {
  const schema = Joi.object({
    billingDetails: billingSchema.required(),
    items: Joi.array().items(itemSchema).min(1).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const rejectOrderValidator = (data) => {
  const schema = Joi.object({
    reason: Joi.string().trim().min(10).max(500).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const fulfillOrderValidator = (data) => {
  const schema = Joi.object({
    keys: Joi.array().items(
      Joi.object({
        gameId: Joi.string().trim().required(),
        key: Joi.string().trim().min(4).max(200).required(),
      })
    ).min(1).required(),
    adminNotes: Joi.string().trim().max(500).allow('').optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const adminListValidator = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid(...Object.values(ORDER_STATUS)).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  });
  return schema.validate(data, { abortEarly: false });
};

export const userListValidator = (data) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  });
  return schema.validate(data, { abortEarly: false });
};
