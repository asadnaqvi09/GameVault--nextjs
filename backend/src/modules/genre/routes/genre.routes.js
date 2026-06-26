import express from 'express';
import * as genre from '../controllers/genre.controller.js';

const router = express.Router();

router.get('/get-all-genre', genre.getAllGenre);
router.post('/add-genre', genre.addGenre);
router.put('/update-genre', genre.updateGenre);
router.delete('/delete-genre', genre.deleteGenre);

export default router;
