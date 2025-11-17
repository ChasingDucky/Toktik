import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { VideoLibrary, CloudUpload, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 加载视频列表
  const loadVideos = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const response = await videoAPI.getFeed(pageNum, 10);

      if (response.data && response.data.length === 0) {
        setHasMore(false);
      } else if (response.data) {
        setVideos((prev) => pageNum === 1 ? response.data : [...prev, ...response.data]);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
      setError(error.message || '加载视频失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos(1);
  }, []);

  // 滚动到下一个视频时加载更多
  useEffect(() => {
    if (currentVideoIndex >= videos.length - 2 && hasMore && !loading) {
      setPage((prev) => prev + 1);
      loadVideos(page + 1);
    }
  }, [currentVideoIndex, videos.length, hasMore, loading, page, loadVideos]);

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  // 加载状态
  if (loading && videos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#000',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: '#fe2c55' }} size={60} />
        <Typography variant="body1" sx={{ color: '#fff' }}>
          正在加载精彩内容...
        </Typography>
      </Box>
    );
  }

  // 错误状态
  if (error && videos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          gap: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          😕 加载失败
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => loadVideos(1)}
          sx={{ mt: 2 }}
        >
          重新加载
        </Button>
      </Box>
    );
  }

  // 空状态
  if (!loading && videos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          gap: 3,
          px: 3,
        }}
      >
        <VideoLibrary sx={{ fontSize: 100, color: '#fe2c55', opacity: 0.5 }} />
        <Typography variant="h5" fontWeight="bold" align="center">
          暂无视频
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
          还没有人发布视频哦～{isAuthenticated ? '成为第一个分享精彩瞬间的人吧！' : '登录后上传你的第一个视频吧！'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/upload')}
              sx={{
                backgroundColor: '#fe2c55',
                '&:hover': { backgroundColor: '#e02849' },
              }}
            >
              上传视频
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#fe2c55',
                '&:hover': { backgroundColor: '#e02849' },
              }}
            >
              立即登录
            </Button>
          )}
          <Button
            variant="outlined"
            size="large"
            startIcon={<Refresh />}
            onClick={() => loadVideos(1)}
            sx={{
              borderColor: '#fe2c55',
              color: '#fe2c55',
              '&:hover': { borderColor: '#e02849', backgroundColor: 'rgba(254, 44, 85, 0.1)' },
            }}
          >
            刷新
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {videos.map((video, index) => (
        <VideoPlayer
          key={video._id}
          video={video}
          onVideoChange={() => handleVideoChange(index)}
        />
      ))}

      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000',
          }}
        >
          <CircularProgress sx={{ color: '#fe2c55' }} />
        </Box>
      )}
    </Box>
  );
};

export default VideoFeed;
