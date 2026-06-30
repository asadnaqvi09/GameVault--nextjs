import Joi from 'joi';
import Contact from '../models/contact.model.js';

export const adminListValidator = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'read', 'replied').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    search: Joi.string().trim().max(100).allow('').optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const updateStatusValidator = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'read', 'replied').required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const listContactsForAdmin = async ({ status, page, limit, search }) => {
  const filter = {};
  if (status) filter.status = status;
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { message: regex },
    ];
  }
  const skip = (page - 1) * limit;
  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);
  return {
    contacts: contacts.map((c) => ({
      id: c._id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      message: c.message,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};
