import { Schema, model, Document } from 'mongoose';

export interface ILike extends Document {
  user: Schema.Types.ObjectId;
  song: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
