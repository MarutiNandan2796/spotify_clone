import { Schema, model, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artist: Schema.Types.ObjectId;
  coverImage: string;
  releaseDate: string;
  genre: string;
  songs: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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
