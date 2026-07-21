import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the Album document model in Mongoose database.
 */
export interface IAlbum extends Document {
  /** The title of the album */
  title: string;
  /** Reference ID of the Artist who created this album */
  artist: Schema.Types.ObjectId;
  /** Image URL for the album's artwork */
  coverImage: string;
  /** Year or exact release date of the album */
  releaseDate: string;
  /** Music genre associated with the album */
  genre: string;
  /** Array of Song reference IDs linked to this album */
  songs: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the Album resource.
 */
const AlbumSchema = new Schema<IAlbum>(
  {
    title: {
      type: String,
      required: [true, 'Please provide album title'],
      trim: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: '',
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
  },
  { timestamps: true }
);

export default model<IAlbum>('Album', AlbumSchema);
