import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  // Prevent multiple connections in serverless environments
  if (mongoose.connections[0].readyState) {
    isConnected = mongoose.connections[0].readyState === 1;
    return;
  }

  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't throw in production to prevent crashes
    if (process.env.NODE_ENV === 'development') {
      throw new Error("Failed to connect to MongoDB");
    }
  }
};