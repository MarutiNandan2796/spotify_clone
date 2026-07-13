import { Router } from 'express';
import {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
} from '../controllers/playlistController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(protect);

router.get('/', getUserPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', createPlaylist);
router.put('/:id', upload.single('coverImage'), updatePlaylist);
router.delete('/:id', deletePlaylist);

router.post('/songs', addSongToPlaylist);
router.delete('/songs', removeSongFromPlaylist);
router.put('/:id/songs', reorderPlaylistSongs);

export default router;
