const Video = require('../models/Video');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Upload new video
// @route   POST /api/videos
// @access  Private
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, musicName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      user: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      musicName
    });

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get feed videos (For You page)
// @route   GET /api/videos/feed
// @access  Public
exports.getFeedVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar verified')
      .lean();

    const total = await Video.countDocuments({ isPublic: true });

    res.json({
      success: true,
      data: videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username avatar verified followers')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user videos
// @route   GET /api/videos/user/:userId
// @access  Public
exports.getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      user: req.params.userId,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar verified');

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/Unlike video
// @route   POST /api/videos/:id/like
// @access  Private
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const alreadyLiked = video.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { likedVideos: video._id }
      });
    } else {
      // Like
      video.likes.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { likedVideos: video._id }
      });

      // Create notification for video owner
      await createNotification(
        video.user,
        req.user._id,
        'like',
        { videoId: video._id }
      );
    }

    await video.save();

    res.json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likeCount: video.likes.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Check if user owns the video
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video'
      });
    }

    await video.deleteOne();

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
