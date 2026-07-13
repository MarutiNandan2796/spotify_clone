import { Request, Response, NextFunction } from 'express';
import Song from '../models/Song';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Playlist from '../models/Playlist';
import { AuthRequest } from '../middleware/authMiddleware';

export const globalSearch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(200).json({
        success: true,
        songs: [],
        artists: [],
        albums: [],
        playlists: [],
      });
    }

    const regex = new RegExp(query, 'i');

    const [songs, artists, albums, playlists] = await Promise.all([
      Song.find({ title: regex })
        .populate('artist', 'name avatar')
        .populate('album', 'title coverImage')
        .limit(10),
      Artist.find({ name: regex }).limit(10),
      Album.find({ title: regex }).populate('artist', 'name avatar').limit(10),
      Playlist.find({
        name: regex,
        $or: [{ creator: req.user.id }, { isPublic: true }],
      })
        .populate('creator', 'name')
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      songs,
      artists,
      albums,
      playlists,
    });
  } catch (error) {
    next(error);
  }
};
