import { Response, NextFunction } from 'express';
import History from '../models/History';
import Song from '../models/Song';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Retrieves the recently played songs (up to 30 items) for the logged in user.
 * @param req - AuthRequest containing user identity
 * @param res - Express response object
 * @param next - Next function callback
 */
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

/**
 * Adds a song to the user's play history and increments the song's play counter.
 * @param req - AuthRequest containing user identity and song ID in params
 * @param res - Express response object
 * @param next - Next function callback
 */
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
