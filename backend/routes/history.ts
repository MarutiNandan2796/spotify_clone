import { Router } from 'express';
import { getHistory, addToHistory } from '../controllers/historyController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getHistory);
router.post('/play/:songId', addToHistory);

export default router;
