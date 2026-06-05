import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);
  return mongoose.connect(env.MONGODB_URI);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
