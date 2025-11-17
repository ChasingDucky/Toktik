import React, { useRef, useEffect, useState } from 'react';
import { Box, IconButton, Typography, Avatar, Chip } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  Bookmark,
  BookmarkBorder,
  MoreVert,
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { videoAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const VideoPlayer = ({ video, onVideoChange }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes?.length || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useSnackbar();

  // 使用IntersectionObserver检测视频是否在视口中
  const { ref, inView } = useInView({
    threshold: 0.7, // 70%可见时触发
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (inView) {
      videoElement.play().catch(console.error);
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  useEffect(() => {
    if (user && video.likes?.includes(user._id)) {
      setLiked(true);
    }
    // Check if video is bookmarked (we'll need to pass this from parent or fetch)
    checkIfBookmarked();
  }, [user, video]);

  const checkIfBookmarked = async () => {
    if (!isAuthenticated) return;

    try {
      // We'll check by fetching user's favorites and seeing if this video is in it
      // For now, we can set it based on a prop or make an API call
      const response = await videoAPI.getFavorites();
      const isFavorite = response.data.some(v => v._id === video._id);
      setBookmarked(isFavorite);
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
    }
  };

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    const videoElement = videoRef.current;
    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showInfo('请先登录');
      return;
    }

    try {
      const response = await videoAPI.likeVideo(video._id);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
      if (response.data.liked) {
        showSuccess('点赞成功');
      }
    } catch (error) {
      console.error('Failed to like video:', error);
      showError('操作失败，请重试');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showInfo('请先登录');
      return;
    }

    try {
      const response = await videoAPI.bookmarkVideo(video._id);
      setBookmarked(response.data.bookmarked);
      if (response.data.bookmarked) {
        showSuccess('已添加到收藏');
      } else {
        showInfo('已取消收藏');
      }
    } catch (error) {
      console.error('Failed to bookmark video:', error);
      showError('操作失败，请重试');
    }
  };

  const handleShare = async () => {
    // 优先使用原生分享API
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (error) {
        // 用户取消分享时不显示错误
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // 降级到复制链接
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('链接已复制到剪贴板');
      } catch (error) {
        console.error('Failed to copy:', error);
        showError('复制失败，请手动复制链接');
      }
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        scrollSnapAlign: 'start',
      }}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        onClick={handlePlayPause}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* 播放/暂停按钮 */}
      {!isPlaying && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <IconButton
            onClick={handlePlayPause}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            <PlayArrow sx={{ fontSize: 60 }} />
          </IconButton>
        </Box>
      )}

      {/* 音量控制 */}
      <IconButton
        onClick={handleMuteToggle}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>

      {/* 右侧操作栏 */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
        }}
      >
        {/* 用户头像 */}
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={video.user?.avatar}
            sx={{ width: 48, height: 48, border: '2px solid white' }}
          />
        </Box>

        {/* 点赞按钮 */}
        <motion.div whileTap={{ scale: 1.2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={handleLike} sx={{ color: 'white' }}>
              {liked ? (
                <Favorite sx={{ fontSize: 32, color: '#fe2c55' }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 32 }} />
              )}
            </IconButton>
            <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
              {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
            </Typography>
          </Box>
        </motion.div>

        {/* 评论按钮 */}
        <Box sx={{ textAlign: 'center' }}>
          <IconButton
            onClick={() => setShowComments(!showComments)}
            sx={{ color: 'white' }}
          >
            <ChatBubbleOutline sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
            {video.comments?.length || 0}
          </Typography>
        </Box>

        {/* 收藏按钮 */}
        <motion.div whileTap={{ scale: 1.2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton onClick={handleBookmark} sx={{ color: 'white' }}>
              {bookmarked ? (
                <Bookmark sx={{ fontSize: 32, color: '#ffc107' }} />
              ) : (
                <BookmarkBorder sx={{ fontSize: 32 }} />
              )}
            </IconButton>
            <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
              {bookmarked ? '已收藏' : '收藏'}
            </Typography>
          </Box>
        </motion.div>

        {/* 分享按钮 */}
        <Box sx={{ textAlign: 'center' }}>
          <IconButton onClick={handleShare} sx={{ color: 'white' }}>
            <Share sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
            分享
          </Typography>
        </Box>
      </Box>

      {/* 底部信息栏 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            @{video.user?.username}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {formatDistanceToNow(new Date(video.createdAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {video.description || video.title}
        </Typography>

        {video.tags && video.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {video.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            ))}
          </Box>
        )}

        {video.musicName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              🎵 {video.musicName}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideoPlayer;
