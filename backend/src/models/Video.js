const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please add a video URL']
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  musicName: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ createdAt: -1 });

// Virtual for like count
videoSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
videoSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

module.exports = mongoose.model('Video', videoSchema);
