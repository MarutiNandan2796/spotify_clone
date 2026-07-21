import { Request, Response, NextFunction } from 'express';
import Artist from '../models/Artist';
import Song from '../models/Song';
import Album from '../models/Album';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';

/**
 * Retrieves all artists in the database.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function callback
 */
export const getAllArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artists = await Artist.find();
    res.status(200).json({ success: true, count: artists.length, artists });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single artist profile by ID along with their popular tracks, albums, and similar artists.
 * @param req - Express request object containing artist ID in params
 * @param res - Express response object
 * @param next - Next function callback
 */
export const getArtistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    // Get popular songs by this artist
    const popularSongs = await Song.find({ artist: artistId })
      .sort({ plays: -1 })
      .limit(5)
      .populate('album', 'title coverImage');

    // Get albums by this artist
    const albums = await Album.find({ artist: artistId });

    // Suggest similar artists (any artist that is not the current one)
    const similarArtists = await Artist.find({ _id: { $ne: artistId } }).limit(4);

    res.status(200).json({
      success: true,
      artist,
      popularSongs,
      albums,
      similarArtists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new artist profile, uploading an avatar and cover banner if provided.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function callback
 */
export const createArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, bio, monthlyListeners } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Artist name is required' });
    }

    const artistExists = await Artist.findOne({ name });
    if (artistExists) {
      return res.status(400).json({ success: false, message: 'Artist already exists' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop';
    let coverBanner = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop';

    if (files) {
      if (files['avatar'] && files['avatar'].length > 0) {
        avatar = await uploadToCloudinary(files['avatar'][0].path, 'image');
      }
      if (files['coverBanner'] && files['coverBanner'].length > 0) {
        coverBanner = await uploadToCloudinary(files['coverBanner'][0].path, 'image');
      }
    }

    const artist = await Artist.create({
      name,
      bio: bio || '',
      monthlyListeners: monthlyListeners ? parseInt(monthlyListeners) : Math.floor(Math.random() * 500000) + 100000,
      avatar,
      coverBanner,
    });

    res.status(201).json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes an artist profile by ID, as well as all songs and albums associated with them.
 * @param req - Express request object containing artist ID in params
 * @param res - Express response object
 * @param next - Next function callback
 */
export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    // Delete artist's songs and albums
    await Song.deleteMany({ artist: artistId });
    await Album.deleteMany({ artist: artistId });
    await artist.deleteOne();

    res.status(200).json({ success: true, message: 'Artist deleted successfully' });
  } catch (error) {
    next(error);
  }
};
