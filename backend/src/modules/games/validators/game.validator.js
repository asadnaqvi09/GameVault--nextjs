import Joi from 'joi';
import { allowedGenre } from '../../genre/validators/genre.validator.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const featureSchema = Joi.object({
  id: Joi.string().trim().allow('', null),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  image: Joi.string().uri().allow(null, '')
});

const gameBodySchema = {
  id: Joi.string().trim().lowercase().pattern(slugPattern).required(),
  title: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  oldPrice: Joi.number().min(0).allow(null),
  rating: Joi.number().min(0).max(5).default(0),
  reviewCount: Joi.number().min(0).default(0),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  smallDescription: Joi.string().trim().required(),
  coverImage: Joi.string().uri().allow('', null),
  genre: Joi.string().trim().valid(...allowedGenre).required(),
  gameMode: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ).required(),
  ageRestrictionBadge: Joi.string().trim().allow('', null),
  options: Joi.object({
    platforms: Joi.array().items(Joi.string().trim()).default([]),
    editions: Joi.array().items(Joi.string().trim()).default([])
  }).default(),
  specifications: Joi.object({
    releaseDate: Joi.date().required(),
    publisher: Joi.string().trim().required(),
    developer: Joi.string().trim().required(),
    languages: Joi.array().items(Joi.string().trim()).default([]),
    audio: Joi.array().items(Joi.string().trim()).default([])
  }).required(),
  detailedDescription: Joi.object({
    topGalleryImages: Joi.array().items(Joi.string().uri()).default([]),
    mainVideoUrl: Joi.string().uri().allow('', null),
    features: Joi.array().items(featureSchema).default([])
  }).default(),
  isActive: Joi.boolean().default(true)
};

export const createGameValidator = (data) =>
  Joi.object(gameBodySchema).validate(data, { abortEarly: false });

export const updateGameValidator = (data) =>
  Joi.object({ ...gameBodySchema, id: Joi.forbidden() }).validate(data, { abortEarly: false });

export const patchGameValidator = (data) =>
  Joi.object({
    price: Joi.number().min(0),
    oldPrice: Joi.number().min(0).allow(null),
    tags: Joi.array().items(Joi.string().trim()),
    isActive: Joi.boolean()
  }).min(1).validate(data, { abortEarly: false });

export const listQueryValidator = (data) =>
  Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(9),
    genre: Joi.string().trim().lowercase(),
    platform: Joi.string().trim(),
    language: Joi.string().trim(),
    minPrice: Joi.number().min(0).default(0),
    maxPrice: Joi.number().min(0).default(500),
    sort: Joi.string().valid('default', 'low-to-high', 'high-to-low', 'average-rating', 'latest').default('default'),
    stock_status: Joi.string().valid('onsale'),
    tags: Joi.string().trim(),
    search: Joi.string().trim().max(100)
  }).validate(data, { abortEarly: false });

export const adminListQueryValidator = (data) =>
  Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100).allow('').optional(),
    isActive: Joi.string().valid('true', 'false').optional(),
  }).validate(data, { abortEarly: false });