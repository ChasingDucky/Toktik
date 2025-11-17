const express = require('express');
const router = express.Router();
const {
  getTrendingVideos,
  getAllTags,
  getVideosByTag,
  getRecommendedUsers,
  search
} = require('../controllers/discoverController');

router.get('/trending', getTrendingVideos);
router.get('/tags', getAllTags);
router.get('/tags/:tag', getVideosByTag);
router.get('/users', getRecommendedUsers);
router.get('/search', search);

module.exports = router;
