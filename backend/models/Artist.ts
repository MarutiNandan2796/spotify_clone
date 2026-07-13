import { Schema, model, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  avatar: string;
  bio: string;
  monthlyListeners: number;
  coverBanner: string;
  createdAt: Date;
  updatedAt: Date;
}

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
