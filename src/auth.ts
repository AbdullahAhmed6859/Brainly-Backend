import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "secret";

export function signToken(userId: mongoose.Types.ObjectId) {
  return jwt.sign({ id: userId }, JWT_SECRET);
}

export function decodeToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
