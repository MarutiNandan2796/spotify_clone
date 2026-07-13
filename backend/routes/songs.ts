import { Router } from 'express';
import {
  getAllSongs,
  getSongById,
  getTrendingSongs,
  getFeaturedSongs,
  createSong,
  deleteSong,
} from '../controllers/songController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getAllSongs);
router.get('/trending', getTrendingSongs);
router.get('/featured', getFeaturedSongs);
router.get('/:id', getSongById);

// Admin only routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  createSong
);
router.delete('/:id', protect, adminOnly, deleteSong);

export default router;
