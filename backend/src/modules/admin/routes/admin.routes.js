import { Router } from 'express';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';
import { getDashboardStats } from '../controllers/admin.controller.js';

const router = Router();
const admin = [protect, authorize('Admin')];

router.get('/dashboard/stats', admin, getDashboardStats);

export default router;
