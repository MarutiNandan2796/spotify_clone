import { Router } from 'express';
import {
  getAllArtists,
  getArtistById,
  createArtist,
  deleteArtist,
} from '../controllers/artistController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);

// Admin only routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverBanner', maxCount: 1 },
  ]),
  createArtist
);
router.delete('/:id', protect, adminOnly, deleteArtist);

export default router;
