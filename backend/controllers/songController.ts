import { Request, Response, NextFunction } from 'express';
import Song from '../models/Song';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Playlist from '../models/Playlist';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';

export const getAllSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await Song.find()
      .populate('artist', 'name avatar')
      .populate('album', 'title coverImage');

    res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name avatar bio monthlyListeners coverBanner')
      .populate('album', 'title coverImage releaseDate');

    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    res.status(200).json({ success: true, song });
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await Song.find()
      .sort({ plays: -1 })
      .limit(10)
      .populate('artist', 'name avatar')
      .populate('album', 'title coverImage');

    res.status(200).json({ success: true, songs });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await Song.find({ isFeatured: true })
      .populate('artist', 'name avatar')
      .populate('album', 'title coverImage');

    res.status(200).json({ success: true, songs });
  } catch (error) {
    next(error);
  }
};

export const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artistId, albumId, duration, genre, isFeatured } = req.body;

    if (!title || !artistId || !duration) {
      return res.status(400).json({ success: false, message: 'Title, artist, and duration are required' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files['audio'] || files['audio'].length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file' });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    // Upload audio and image
    const audioLocalPath = files['audio'][0].path;
    const audioUrl = await uploadToCloudinary(audioLocalPath, 'video'); // Cloudinary requires 'video' resource_type for audio files

    let coverImage = '';
    if (files['coverImage'] && files['coverImage'].length > 0) {
      coverImage = await uploadToCloudinary(files['coverImage'][0].path, 'image');
    } else {
      // Use artist avatar or album cover as default if image is missing
      if (albumId) {
        const album = await Album.findById(albumId);
        if (album) coverImage = album.coverImage;
      }
      if (!coverImage) {
        coverImage = artist.avatar || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop';
      }
    }

    const song = await Song.create({
      title,
      artist: artistId,
      album: albumId || undefined,
      audioUrl,
      coverImage,
      duration: parseFloat(duration),
      genre: genre || 'Pop',
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    // Link song to Album if albumId is provided
    if (albumId) {
      const album = await Album.findById(albumId);
      if (album) {
        album.songs.push(song._id as any);
        await album.save();
      }
    }

    res.status(201).json({ success: true, song });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.id;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    // Remove song from all albums
    if (song.album) {
      await Album.findByIdAndUpdate(song.album, { $pull: { songs: songId } });
    }

    // Remove song from all playlists
    await Playlist.updateMany({ songs: songId }, { $pull: { songs: songId } });

    await song.deleteOne();

    res.status(200).json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};
