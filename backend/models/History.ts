import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the History document model in Mongoose database.
 * Tracks when a specific user plays a song.
 */
export interface IHistory extends Document {
  /** Reference ID of the User who played the song */
  user: Schema.Types.ObjectId;
  /** Reference ID of the Song that was played */
  song: Schema.Types.ObjectId;
  /** Timestamp when the song play occurred */
  playedAt: Date;
}

/**
 * Mongoose Schema definition for the History resource.
 */
const HistorySchema = new Schema<IHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    song: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model<IHistory>('History', HistorySchema);
