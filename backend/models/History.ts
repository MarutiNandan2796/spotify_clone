import { Schema, model, Document } from 'mongoose';

export interface IHistory extends Document {
  user: Schema.Types.ObjectId;
  song: Schema.Types.ObjectId;
  playedAt: Date;
}

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
