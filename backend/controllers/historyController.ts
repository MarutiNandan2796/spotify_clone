import { Response, NextFunction } from 'express';
import History from '../models/History';
import Song from '../models/Song';
import { AuthRequest } from '../middleware/authMiddleware';

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const historyLogs = await History.find({ user: req.user.id })
      .sort({ playedAt: -1 })
      .limit(30)
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name avatar' },
          { path: 'album', select: 'title coverImage' },
        ],
      });

    // Remove null songs if any were deleted
    const songs = historyLogs.map((log) => log.song).filter(Boolean);

    res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    next(error);
  }
};

export const addToHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    // Insert play history record
    await History.create({ user: userId, song: songId });

    // Increment play count of the song
    song.plays += 1;
    await song.save();

    res.status(201).json({ success: true, message: 'Added to history and play count incremented' });
  } catch (error) {
    next(error);
  }
};
