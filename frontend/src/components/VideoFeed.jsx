import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import VideoPlayer from './VideoPlayer';
import { videoAPI } from '../services/api';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef(null);

  // 加载视频列表
  const loadVideos = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await videoAPI.getFeed(pageNum, 10);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => [...prev, ...response.data]);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos(1);
  }, [loadVideos]);

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

  if (loading && videos.length === 0) {
    return (
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
