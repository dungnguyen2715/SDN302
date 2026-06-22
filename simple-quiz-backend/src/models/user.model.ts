import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  admin: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", UserSchema);
