const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
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
  timestamps: true // This creates createdAt and updatedAt automatically
});

// Create indexes for better performance
urlSchema.index({ createdAt: -1 });

const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

module.exports = Url;