import { Schema, model, Document } from 'mongoose';

/**
 * Interface representing the User document model in Mongoose database.
 */
export interface IUser extends Document {
  /** The display name of the user */
  name: string;
  /** Unique email address of the user */
  email: string;
  /** Hashed password of the user (optional for social/testing integration scenarios) */
  password?: string;
  /** Avatar image URL of the user */
  avatar: string;
  /** Access role for authentication/authorization ('user' | 'admin') */
  role: 'user' | 'admin';
  /** Array of Playlist reference IDs created or saved by this user */
  playlists: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema definition for the User resource.
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Playlist',
      },
    ],
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
