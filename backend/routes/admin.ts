import { Router } from 'express';
import { getDashboardAnalytics, getAllUsers, deleteUser } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get('/analytics', getDashboardAnalytics);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
