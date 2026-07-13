import { Schema, model, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: Schema.Types.ObjectId;
  album?: Schema.Types.ObjectId;
  audioUrl: string;
  coverImage: string;
  duration: number;
  genre: string;
  plays: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: [true, 'Please provide song title'],
      trim: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
    },
    audioUrl: {
      type: String,
      required: [true, 'Please provide audio URL'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in seconds'],
    },
    genre: {
      type: String,
      default: '',
    },
    plays: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<ISong>('Song', SongSchema);
