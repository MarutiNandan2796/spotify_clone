import { Router } from 'express';
import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  deleteAlbum,
} from '../controllers/albumController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);

// Admin only routes
router.post('/', protect, adminOnly, upload.single('coverImage'), createAlbum);
router.delete('/:id', protect, adminOnly, deleteAlbum);

export default router;
