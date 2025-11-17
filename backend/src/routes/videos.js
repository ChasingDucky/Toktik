const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  getFeedVideos,
  getVideo,
  getUserVideos,
  likeVideo,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/feed', getFeedVideos);
router.get('/:id', getVideo);
router.get('/user/:userId', getUserVideos);
router.post('/', protect, upload.single('video'), uploadVideo);
router.post('/:id/like', protect, likeVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;
