import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function signToken(userId: mongoose.Types.ObjectId) {
  return jwt.sign({ id: userId }, JWT_SECRET);
}

export function decodeToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
