import Joi from 'joi';

export const createReviewValidator = (data) =>
  Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().min(10).max(2000).required()
  }).validate(data, { abortEarly: false });

export const updateReviewValidator = (data) =>
  Joi.object({
    rating: Joi.number().integer().min(1).max(5),
    comment: Joi.string().trim().min(10).max(2000)
  }).min(1).validate(data, { abortEarly: false });

export const listQueryValidator = (data) =>
  Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    sort: Joi.string()
      .valid('default', 'most-recent', 'highest-rating', 'lowest-rating')
      .default('default')
  }).validate(data, { abortEarly: false });

export const moderationValidator = (data) =>
  Joi.object({
    isApproved: Joi.boolean().required()
  }).validate(data, { abortEarly: false });