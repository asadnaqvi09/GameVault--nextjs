import express from 'express';
import * as genre from '../controllers/genre.controller.js';
import { protect } from '../../../shared/middlewares/auth.middleware.js';
import { authorize } from '../../../shared/middlewares/role.middleware.js';

const router = express.Router();
const admin = [protect, authorize('Admin')];

router.get('/get-all-genre', genre.getAllGenre);
router.post('/add-genre', admin, genre.addGenre);
router.put('/update-genre/:id', admin, genre.updateGenre);
router.delete('/delete-genre/:id', admin, genre.deleteGenre);

export default router;
