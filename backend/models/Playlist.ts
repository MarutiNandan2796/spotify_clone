import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the Playlist document model in Mongoose database.
 * Supports public and private playlists created by users.
 */
export interface IPlaylist extends Document {
  /** The name of the playlist */
  name: string;
  /** Playlist description */
  description: string;
  /** Cover image artwork URL for the playlist */
  coverImage: string;
  /** Reference ID of the User who created the playlist */
  creator: Schema.Types.ObjectId;
  /** Array of Song reference IDs associated with the playlist */
  songs: Schema.Types.ObjectId[];
  /** Visibility status of the playlist (true for public, false for private) */
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the Playlist resource.
 */
const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: [true, 'Please provide playlist name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<IPlaylist>('Playlist', PlaylistSchema);
