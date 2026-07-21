import { Request, Response, NextFunction } from 'express';
import Album from '../models/Album';
import Song from '../models/Song';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';

/**
 * Retrieves all albums in the database, populating their artist information.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function callback
 */
export const getAllAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await Album.find().populate('artist', 'name avatar');
    res.status(200).json({ success: true, count: albums.length, albums });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single album by its ID, populating artist info and the tracks linked to it.
 * @param req - Express request object containing album ID in params
 * @param res - Express response object
 * @param next - Next function callback
 */
export const getAlbumById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name avatar bio coverBanner')
      .populate({
        path: 'songs',
        populate: {
          path: 'artist',
          select: 'name avatar',
        },
      });

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    res.status(200).json({ success: true, album });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new album. Uploads a cover image to Cloudinary if provided.
 * @param req - Express request object containing body parameter title, artistId, releaseDate, genre
 * @param res - Express response object
 * @param next - Next function callback
 */
export const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artistId, releaseDate, genre } = req.body;

    if (!title || !artistId) {
      return res.status(400).json({ success: false, message: 'Album title and artist are required' });
    }

    let coverImage = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop';
    if (req.file) {
      coverImage = await uploadToCloudinary(req.file.path, 'image');
    }

    const album = await Album.create({
      title,
      artist: artistId,
      releaseDate: releaseDate || new Date().getFullYear().toString(),
      genre: genre || 'Pop',
      coverImage,
      songs: [],
    });

    res.status(201).json({ success: true, album });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an album by its ID and unsets the album field from all associated songs.
 * @param req - Express request object containing album ID in params
 * @param res - Express response object
 * @param next - Next function callback
 */
export const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Set all songs linked to this album to have no album
    await Song.updateMany({ album: albumId }, { $unset: { album: '' } });

    await album.deleteOne();

    res.status(200).json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    next(error);
  }
};
