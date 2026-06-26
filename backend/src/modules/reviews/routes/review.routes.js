import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';
import { reviewLimiter } from '../../../shared/middlewares/rateLimiter.middleware.js';

const router = Router();
const admin = [protect, authorize('Admin')];

// Static / nested paths FIRST
router.get('/me', protect, reviewController.getMyReviews);
router.get('/game/:slug/summary', reviewController.getGameReviewSummary);
router.get('/game/:slug', reviewController.getGameReviews);
router.post('/game/:slug', protect, reviewLimiter, reviewController.createReview);

// Admin moderation (PATCH before generic PUT is fine — different methods)
router.patch('/:reviewId', admin, reviewController.moderateReview);
router.delete('/:reviewId/hard', admin, reviewController.hardDeleteReview);

// User-owned
router.put('/:reviewId', protect, reviewLimiter, reviewController.updateReview);
router.delete('/:reviewId', protect, reviewController.deleteReview);

export default router;