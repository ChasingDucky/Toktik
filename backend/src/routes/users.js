const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  followUser,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', searchUsers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/:id/follow', protect, followUser);

module.exports = router;
