import { Schema, model, Document } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description: string;
  coverImage: string;
  creator: Schema.Types.ObjectId;
  songs: Schema.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
