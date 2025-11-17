const Video = require('../models/Video');
const User = require('../models/User');

// @desc    获取热门视频（按点赞数和浏览量排序）
// @route   GET /api/discover/trending
// @access  Public
exports.getTrendingVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ isPublic: true })
      .populate('user', 'username avatar verified')
      .sort({ views: -1, 'likes': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 添加点赞数统计
    const videosWithStats = videos.map(video => ({
      ...video,
      likeCount: video.likes?.length || 0,
      commentCount: video.comments?.length || 0
    }));

    const total = await Video.countDocuments({ isPublic: true });

    res.json({
      success: true,
      data: videosWithStats,
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

// @desc    获取所有标签
// @route   GET /api/discover/tags
// @access  Public
exports.getAllTags = async (req, res) => {
  try {
    // 聚合所有标签及其视频数量
    const tags = await Video.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
          videos: { $push: '$_id' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    const formattedTags = tags.map(tag => ({
      name: tag._id,
      count: tag.count,
      videoCount: tag.count
    }));

    res.json({
      success: true,
      data: formattedTags
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    根据标签获取视频
// @route   GET /api/discover/tags/:tag
// @access  Public
exports.getVideosByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find({
      isPublic: true,
      tags: { $regex: new RegExp(tag, 'i') }
    })
      .populate('user', 'username avatar verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Video.countDocuments({
      isPublic: true,
      tags: { $regex: new RegExp(tag, 'i') }
    });

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

// @desc    获取推荐用户
// @route   GET /api/discover/users
// @access  Public
exports.getRecommendedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // 获取粉丝数最多的用户
    const users = await User.find()
      .select('username avatar bio verified followers')
      .sort({ followers: -1 })
      .limit(limit)
      .lean();

    const usersWithStats = users.map(user => ({
      ...user,
      followerCount: user.followers?.length || 0
    }));

    res.json({
      success: true,
      data: usersWithStats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    搜索视频和用户
// @route   GET /api/discover/search
// @access  Public
exports.search = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const results = {};

    // 搜索视频
    if (type === 'all' || type === 'videos') {
      const videos = await Video.find({
        isPublic: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      })
        .populate('user', 'username avatar verified')
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const videoTotal = await Video.countDocuments({
        isPublic: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      });

      results.videos = {
        data: videos,
        total: videoTotal
      };
    }

    // 搜索用户
    if (type === 'all' || type === 'users') {
      const users = await User.find({
        $or: [
          { username: searchRegex },
          { bio: searchRegex }
        ]
      })
        .select('username avatar bio verified followers')
        .limit(type === 'all' ? 10 : limit)
        .lean();

      const userTotal = await User.countDocuments({
        $or: [
          { username: searchRegex },
          { bio: searchRegex }
        ]
      });

      results.users = {
        data: users,
        total: userTotal
      };
    }

    res.json({
      success: true,
      query: q,
      results,
      pagination: {
        page,
        limit
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
