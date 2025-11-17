const Comment = require('../models/Comment');
const Video = require('../models/Video');

// @desc    Add comment to video
// @route   POST /api/videos/:videoId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: videoId,
      parentComment: parentCommentId || null
    });

    // Add comment to video
    video.comments.push(comment._id);
    await video.save();

    // If it's a reply, add to parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get comments for video
// @route   GET /api/videos/:videoId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      video: req.params.videoId,
      parentComment: null
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar verified')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const alreadyLiked = comment.likes.includes(req.user._id);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likeCount: comment.likes.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
