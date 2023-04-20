import mongoose from "mongoose";

export default async function connectMongo() {
  mongoose.connect(process.env.MONGODB_KEY);
}
