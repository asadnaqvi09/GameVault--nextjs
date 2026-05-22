import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as authValidator from '../validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authLimiter, authValidator.validateRegister, authController.register);
router.post('/login', authLimiter, authValidator.validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/reset-password', authLimiter, authValidator.validatePasswordReset, authController.resetPassword);
router.post('/logout', protect, authController.logout);

export default router;