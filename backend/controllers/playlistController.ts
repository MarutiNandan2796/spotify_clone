import { Request, Response, NextFunction } from 'express';
import Playlist from '../models/Playlist';
import Song from '../models/Song';
import User from '../models/User';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUserPlaylists = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const playlists = await Playlist.find({ creator: req.user.id })
      .populate('creator', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: playlists.length, playlists });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('creator', 'name')
      .populate({
        path: 'songs',
        populate: {
          path: 'artist',
          select: 'name avatar',
        },
      });

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Check authorization: must be creator or playlist must be public
    const creatorId = (playlist.creator as any)._id?.toString() || playlist.creator.toString();
    if (creatorId !== req.user.id && !playlist.isPublic) {
      return res.status(403).json({ success: false, message: 'Access denied: Private playlist' });
    }

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, isPublic } = req.body;

    const userPlaylistsCount = await Playlist.countDocuments({ creator: req.user.id });
    const playlistName = name || `My Playlist #${userPlaylistsCount + 1}`;

    const playlist = await Playlist.create({
      name: playlistName,
      description: description || '',
      creator: req.user.id,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
      isPublic: isPublic === 'true' || isPublic === true,
      songs: [],
    });

    // Update user reference
    await User.findByIdAndUpdate(req.user.id, { $push: { playlists: playlist._id as any } });

    res.status(201).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this playlist' });
    }

    const { name, description, isPublic } = req.body;
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic === 'true' || isPublic === true;

    if (req.file) {
      playlist.coverImage = await uploadToCloudinary(req.file.path, 'image');
    }

    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this playlist' });
    }

    // Remove from user playlists array
    await User.findByIdAndUpdate(req.user.id, { $pull: { playlists: playlist._id } });

    await playlist.deleteOne();

    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this playlist' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this playlist' });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

export const reorderPlaylistSongs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { songs } = req.body; // Array of song IDs in new order
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to reorder this playlist' });
    }

    playlist.songs = songs;
    await playlist.save();

    res.status(200).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};
