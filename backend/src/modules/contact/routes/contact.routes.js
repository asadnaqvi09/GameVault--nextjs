import { Router } from 'express';
import { submitContact, getAdminContacts, updateContactStatus } from '../controllers/contact.controller.js';
import { contactLimiter } from '../../../shared/middlewares/rateLimiter.middleware.js';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';

const router = Router();
const admin = [protect, authorize('Admin')];

router.post('/', contactLimiter, submitContact);
router.get('/admin/list', admin, getAdminContacts);
router.patch('/admin/:id', admin, updateContactStatus);

export default router;
