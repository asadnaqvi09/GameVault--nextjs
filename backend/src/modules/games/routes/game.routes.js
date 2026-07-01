import { Router } from 'express';
import * as gameController from '../controllers/game.controller.js';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';
import { uploadProof } from '../../payments/middlewares/uploadProof.middleware.js';

const router = Router();
const admin = [protect, authorize('Admin')];

router.get('/', gameController.getGames);
router.get('/admin/list', admin, gameController.getAdminGames);
router.post('/admin/upload-image', admin, uploadProof.single('image'), gameController.uploadGameImage);
router.get('/admin/:slug', admin, gameController.getAdminGameBySlug);
router.get('/on-sale', gameController.getOnSaleGames);
router.get('/on-sale/count', gameController.getOnSaleCount);
router.get('/top-sellers', gameController.getTopSellers);
router.get('/related/:slug', gameController.getRelatedGames);
router.get('/:slug', gameController.getGameBySlug);

// Admin
router.post('/', admin, gameController.createGame);
router.put('/:slug', admin, gameController.updateGame);
router.patch('/:slug', admin, gameController.patchGame);
router.delete('/:slug', admin, gameController.deleteGame);

export default router;