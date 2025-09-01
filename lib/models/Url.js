import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  original_url: { 
    type: String, 
    required: true,
    trim: true
  },
  short_code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    index: true
  },
  visit_count: { 
    type: Number, 
    default: 0,
    min: 0
  },
}, { 
  timestamps: true 
});

urlSchema.index({ createdAt: -1 });
urlSchema.index({ userId: 1, createdAt: -1 });

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

export default Url;