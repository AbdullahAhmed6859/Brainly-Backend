import { Schema, model, Types } from "mongoose";
import { random } from "./utils";

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

const contentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: false,
  },
});

const linkSchema = new Schema({
  hash: { type: String, default: () => random(10) },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const UserModel = model("User", userSchema);
export const ContentModel = model("Content", contentSchema);
export const LinkModel = model("Link", linkSchema);
