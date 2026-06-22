import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const connStr =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SimpleQuiz";
    await mongoose.connect(connStr);
    console.log("☘️ MongoDB Connected Successfully to SimpleQuiz");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
};
