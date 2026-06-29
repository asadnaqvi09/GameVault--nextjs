import rateLimit from 'express-rate-limit';
import AuditLog from '../models/auditLog.model.js';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.create({
      action: 'RATE_LIMIT_EXCEEDED',
      ipAddress: req.ip,
      details: `Too many attempts on endpoint: ${req.originalUrl}`
    });
    res.status(429).json({
      message: 'Too many attempts. Please try again after 15 minutes.'
    });
  }
});

export const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLog.create({
      action: 'RATE_LIMIT_EXCEEDED',
      ipAddress: req.ip,
      details: `Too many attempts on endpoint: ${req.originalUrl}`
    });
    res.status(429).json({
      message: 'Too many attempts. Please try again after 15 minutes.'
    });
  }
});