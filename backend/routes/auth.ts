import { Router } from 'express';
import { register, login, getMe, updateProfile, searchUsers, toggleFollow, getFriendActivity } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// Social Feed & User Following Routes
router.get('/users/search', protect, searchUsers);
router.post('/users/follow/:id', protect, toggleFollow);
router.get('/users/friends', protect, getFriendActivity);

export default router;
