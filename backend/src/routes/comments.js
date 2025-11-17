const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  likeComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/videos/:videoId/comments', protect, addComment);
router.get('/videos/:videoId/comments', getComments);
router.post('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
