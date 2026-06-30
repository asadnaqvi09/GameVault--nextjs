import { Router } from 'express';
import authRoutes from '../modules/auth/routes/auth.routes.js';
import genreRoutes from '../modules/genre/routes/genre.routes.js';
import gameRoutes from '../modules/games/routes/game.routes.js';
import reviewRoutes from '../modules/reviews/routes/review.routes.js';
import cartRoutes from '../modules/cart/routes/cart.routes.js';
import orderRoutes from '../modules/orders/routes/order.routes.js';
import paymentRoutes from '../modules/payments/routes/payment.routes.js';
import adminRoutes from '../modules/admin/routes/admin.routes.js';
import contactRoutes from '../modules/contact/routes/contact.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

router.use('/auth', authRoutes);
router.use('/genre', genreRoutes);
router.use('/games', gameRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/contact', contactRoutes);

export default router;