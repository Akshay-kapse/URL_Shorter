import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (mongoose.connections[0].readyState) {
    isConnected = mongoose.connections[0].readyState === 1;
    return;
  }
  
  try {
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

    if (process.env.NODE_ENV === "development") {
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    if (process.env.NODE_ENV === "development") {
      throw new Error("Failed to connect to MongoDB");
    }
  }
};

// Dynamic collection creation based on user email
export const getUserUrlCollection = (userEmail) => {
  // Sanitize email for collection name (replace special chars with underscores)
  const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const collectionName = `urls_${sanitizedEmail}`;
  
  // Define schema for user URLs
  const urlSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    original_url: {
      type: String,
      required: true,
      trim: true,
    },
    short_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // index: true,
    },
    visit_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  }, {
    timestamps: true,
  });

  // Create indexes for performance
  urlSchema.index({ createdAt: -1 });
  urlSchema.index({ userId: 1, createdAt: -1 });
  // urlSchema.index({ short_code: 1 }, { unique: true });

  // Return the model for this specific collection
  return mongoose.models[collectionName] || mongoose.model(collectionName, urlSchema, collectionName);
};