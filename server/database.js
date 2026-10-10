import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is required. Use npm run dev for a local MongoDB, or configure it in your environment.",
    );
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
