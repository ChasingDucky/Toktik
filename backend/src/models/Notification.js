const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'reply'],
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    // Optional - only for like and comment notifications
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    // Optional - only for reply notifications
  },
  text: {
    type: String,
    // Optional - for comment/reply content preview
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// Auto-populate sender information
notificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'username avatar verified'
  })
  .populate({
    path: 'video',
    select: 'title videoUrl thumbnail'
  })
  .populate({
    path: 'comment',
    select: 'text'
  });
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
