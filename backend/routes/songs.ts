import { Router } from 'express';
import {
  getAllSongs,
  getSongById,
  getTrendingSongs,
  getFeaturedSongs,
  createSong,
  deleteSong,
  incrementPlayCount,
  getPlaybackAnalytics,
} from '../controllers/songController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getAllSongs);
router.get('/trending', getTrendingSongs);
router.get('/featured', getFeaturedSongs);
router.get('/analytics/summary', getPlaybackAnalytics);
router.post('/:id/play', incrementPlayCount);
router.get('/:id', getSongById);

// Song upload and deletion routes (available to any authenticated user/admin)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  createSong
);
router.delete('/:id', protect, deleteSong);

export default router;
