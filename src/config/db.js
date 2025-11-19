// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not found in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "workdairy"  // Optional but recommended
    });

    console.log("🔥 MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
}
