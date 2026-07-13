import { Response, NextFunction } from 'express';
import Song from '../models/Song';
import Artist from '../models/Artist';
import Album from '../models/Album';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalSongs, totalAlbums, totalArtists, totalUsers] = await Promise.all([
      Song.countDocuments({}),
      Album.countDocuments({}),
      Artist.countDocuments({}),
      User.countDocuments({}),
    ]);

    // Calculate total plays by summing up song play counts
    const songsPlays = await Song.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: '$plays' },
        },
      },
    ]);
    const totalPlays = songsPlays[0]?.totalPlays || 0;

    // Get recent 5 uploads
    const recentSongs = await Song.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('artist', 'name avatar')
      .populate('album', 'title coverImage');

    res.status(200).json({
      success: true,
      analytics: {
        totalSongs,
        totalAlbums,
        totalArtists,
        totalUsers,
        totalPlays,
      },
      recentSongs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.id;

    // Prevent deleting self
    if (req.user.id === targetUserId) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
