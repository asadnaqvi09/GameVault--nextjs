import { Router } from 'express';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';
import { paymentLimiter } from '../../../shared/middlewares/rateLimiter.middleware.js';
import {
  createCodOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getAdminOrders,
  getAdminOrderById,
  approvePayment,
  rejectPayment,
  confirmCod,
  fulfillOrderKeys,
  adminCancelOrder,
} from '../controllers/order.controller.js';

const router = Router();
const admin = [protect, authorize('Admin')];

router.post('/cod', protect, paymentLimiter, createCodOrder);
router.get('/admin/list', admin, getAdminOrders);
router.get('/admin/:id', admin, getAdminOrderById);
router.patch('/admin/:id/approve', admin, approvePayment);
router.patch('/admin/:id/reject', admin, rejectPayment);
router.patch('/admin/:id/confirm-cod', admin, confirmCod);
router.patch('/admin/:id/fulfill', admin, fulfillOrderKeys);
router.patch('/admin/:id/cancel', admin, adminCancelOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getMyOrderById);
router.patch('/:id/cancel', protect, cancelMyOrder);

export default router;
