import { Router } from 'express';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';
import { paymentLimiter } from '../../../shared/middlewares/rateLimiter.middleware.js';
import { uploadProof } from '../middlewares/uploadProof.middleware.js';
import { submitManualPayment, getPendingPayments } from '../controllers/payment.controller.js';

const router = Router();
const admin = [protect, authorize('Admin')];

router.post(
  '/manual/submit',
  protect,
  paymentLimiter,
  uploadProof.single('proofImage'),
  submitManualPayment
);

router.get('/admin/pending', admin, getPendingPayments);

export default router;
