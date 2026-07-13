import { Router } from 'express';
import { getLikedSongs, toggleLikeSong, checkIsLiked } from '../controllers/likeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getLikedSongs);
router.post('/toggle/:songId', toggleLikeSong);
router.get('/check/:songId', checkIsLiked);

export default router;
