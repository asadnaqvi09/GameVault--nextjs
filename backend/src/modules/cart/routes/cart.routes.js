import { Router } from 'express';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { cartLimiter } from '../../../shared/middlewares/rateLimiter.middleware.js';
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '../controllers/cart.controller.js';

const router = Router();

router.use(protect);
router.get('/', getCart);
router.post('/items', cartLimiter, addCartItem);
router.patch('/items/:itemId', cartLimiter, updateCartItem);
router.delete('/items/:itemId', cartLimiter, deleteCartItem);
router.delete('/', clearCart);

export default router;
