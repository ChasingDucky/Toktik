import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import {
  Favorite,
  Visibility,
  PlayArrow,
  BookmarkRemove,
  VideoLibrary,
} from '@mui/icons-material';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated, navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (videoId, event) => {
    event.stopPropagation();
    try {
      await videoAPI.bookmarkVideo(videoId);
      setFavorites((prev) => prev.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress sx={{ color: '#fe2c55' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          我的收藏
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {favorites.length} 个收藏的视频
        </Typography>
      </Box>

      {/* Videos Grid */}
      {favorites.length > 0 ? (
        <Grid container spacing={2}>
          {favorites.map((video) => (
            <Grid item xs={6} sm={4} md={3} key={video._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s',
                  },
                }}
                onClick={() => handleVideoClick(video._id)}
              >
                {/* Video Thumbnail */}
                <Box sx={{ position: 'relative', paddingTop: '177.78%' }}>
                  <video
                    src={video.videoUrl}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 60, color: 'white', opacity: 0.9 }} />
                  </Box>

                  {/* Remove Bookmark Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={(e) => handleRemoveBookmark(video._id, e)}
                  >
                    <BookmarkRemove />
                  </IconButton>
                </Box>

                <CardContent sx={{ p: 1 }}>
                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar src={video.user?.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="caption" noWrap>
                      {video.user?.username}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography variant="body2" noWrap sx={{ mb: 1, fontWeight: 500 }}>
                    {video.title}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                      <Typography variant="caption">{video.likes?.length || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility sx={{ fontSize: 14 }} />
                      <Typography variant="caption">{video.views || 0}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <VideoLibrary sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            还没有收藏的视频
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            浏览视频并点击收藏按钮来保存你喜欢的内容
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            浏览视频
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Favorites;
