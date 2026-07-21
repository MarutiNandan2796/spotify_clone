import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the Artist document model in Mongoose database.
 */
export interface IArtist extends Document {
  /** The display name of the artist */
  name: string;
  /** Image URL for the artist's avatar */
  avatar: string;
  /** Biographical information or description of the artist */
  bio: string;
  /** The calculated number of monthly listeners */
  monthlyListeners: number;
  /** Cover banner image URL displayed on artist details view */
  coverBanner: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the Artist resource.
 */
const ArtistSchema = new Schema<IArtist>(
  {
    name: {
      type: String,
      required: [true, 'Please provide artist name'],
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    monthlyListeners: {
      type: Number,
      default: 0,
    },
    coverBanner: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default model<IArtist>('Artist', ArtistSchema);
