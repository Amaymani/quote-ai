import Quote from './quotes';
import mongoose, { Schema, Document, Model, models } from 'mongoose';


export interface IUser extends Document {
  email: string;
  password: string;
  quotes: mongoose.Schema.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
    },
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote', 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
