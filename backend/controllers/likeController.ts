import { Response, NextFunction } from 'express';
import Like from '../models/Like';
import Song from '../models/Song';
import { AuthRequest } from '../middleware/authMiddleware';

export const getLikedSongs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const likes = await Like.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name avatar' },
          { path: 'album', select: 'title coverImage' },
        ],
      });

    const songs = likes.map((like) => like.song).filter(Boolean);

    res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const existingLike = await Like.findOne({ user: userId, song: songId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      return res.status(200).json({ success: true, liked: false, message: 'Song unliked successfully' });
    } else {
      // Like
      await Like.create({ user: userId, song: songId });
      return res.status(200).json({ success: true, liked: true, message: 'Song liked successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const checkIsLiked = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({ user: userId, song: songId });

    res.status(200).json({ success: true, liked: !!like });
  } catch (error) {
    next(error);
  }
};
