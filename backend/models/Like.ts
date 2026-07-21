import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the Like document model in Mongoose database.
 * Tracks user preference (likes) for particular songs.
 */
export interface ILike extends Document {
  /** Reference ID of the User who liked the song */
  user: Schema.Types.ObjectId;
  /** Reference ID of the Song that was liked */
  song: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the Like resource.
 */
const LikeSchema = new Schema<ILike>(
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
  },
  { timestamps: true }
);

// Compounding unique index to prevent duplicate likes
LikeSchema.index({ user: 1, song: 1 }, { unique: true });

export default model<ILike>('Like', LikeSchema);
