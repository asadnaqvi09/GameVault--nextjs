import Joi from 'joi';
import { PAYMENT_METHOD } from '../../../shared/constants/order.constants.js';

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

export const manualPaymentValidator = (data) => {
  const schema = Joi.object({
    billingDetails: billingSchema.required(),
    items: Joi.array().items(itemSchema).min(1).required(),
    paymentMethod: Joi.string().valid(PAYMENT_METHOD.JAZZCASH, PAYMENT_METHOD.EASYPAISA).required(),
    transactionId: Joi.string().trim().min(4).max(64).required(),
    senderNumber: Joi.string().trim().min(7).max(20).optional().allow(''),
  });
  return schema.validate(data, { abortEarly: false });
};

export const parseMultipartBody = (body) => {
  const parsed = { ...body };
  if (typeof parsed.billingDetails === 'string') {
    parsed.billingDetails = JSON.parse(parsed.billingDetails);
  }
  if (typeof parsed.items === 'string') {
    parsed.items = JSON.parse(parsed.items);
  }
  return parsed;
};
