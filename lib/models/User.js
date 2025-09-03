import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  
  password: {
    type: String,
    required: true,
    select: false,
  },
  resetCode: {
    type: String,
    default: null,
  },
  resetCodeExpires: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for faster queries
userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;