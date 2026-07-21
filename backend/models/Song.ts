import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the Song document model in Mongoose database.
 */
export interface ISong extends Document {
  /** The title of the song track */
  title: string;
  /** Reference ID of the Artist who authored/performed this song */
  artist: Schema.Types.ObjectId;
  /** Reference ID of the Album this song belongs to (optional) */
  album?: Schema.Types.ObjectId;
  /** Public URL endpoint hosting the track's audio file */
  audioUrl: string;
  /** Image URL endpoint hosting the track cover artwork */
  coverImage: string;
  /** The duration of the song in seconds */
  duration: number;
  /** Music genre associated with the song */
  genre: string;
  /** The cumulative playback counter/plays */
  plays: number;
  /** Featured status of the song on homepage dashboard */
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the Song resource.
 */
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
