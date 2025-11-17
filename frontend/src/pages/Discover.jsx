import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Whatshot,
  Tag,
  People,
  PlayArrow,
  Favorite,
  Visibility,
} from '@mui/icons-material';
import { discoverAPI } from '../services/api';

const Discover = () => {
  const [tabValue, setTabValue] = useState(0);
  const [trending, setTrending] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (tabValue === 0) {
        // 热门视频
        const response = await discoverAPI.getTrending(1, 20);
        setTrending(response.data || []);
      } else if (tabValue === 1) {
        // 标签
        const response = await discoverAPI.getAllTags();
        setTags(response.data || []);
      } else if (tabValue === 2) {
        // 推荐用户
        const response = await discoverAPI.getRecommendedUsers(20);
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load discover data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag}`);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab icon={<Whatshot />} label="热门" />
          <Tab icon={<Tag />} label="标签" />
          <Tab icon={<People />} label="推荐用户" />
        </Tabs>
      </Box>

      {/* 热门视频 */}
      {tabValue === 0 && (
        <Grid container spacing={2}>
          {trending.map((video) => (
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
                {/* 视频缩略图 */}
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
                </Box>

                <CardContent sx={{ p: 1 }}>
                  {/* 用户信息 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar src={video.user?.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="caption" noWrap>
                      {video.user?.username}
                    </Typography>
                  </Box>

                  {/* 标题 */}
                  <Typography variant="body2" noWrap sx={{ mb: 1, fontWeight: 500 }}>
                    {video.title}
                  </Typography>

                  {/* 统计信息 */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                      <Typography variant="caption">
                        {video.likeCount || video.likes?.length || 0}
                      </Typography>
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

          {trending.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  暂无热门视频
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* 标签 */}
      {tabValue === 1 && (
        <Box>
          {tags.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={`#${tag.name} (${tag.count})`}
                  onClick={() => handleTagClick(tag.name)}
                  sx={{
                    fontSize: '1rem',
                    py: 3,
                    px: 1,
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                暂无标签
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* 推荐用户 */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleUserClick(user._id)}
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    mb: 2,
                    border: '3px solid',
                    borderColor: 'primary.main',
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  {user.username}
                  {user.verified && ' ✓'}
                </Typography>
                {user.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {user.bio}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {user.followerCount || user.followers?.length || 0} 粉丝
                </Typography>
              </Card>
            </Grid>
          ))}

          {users.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  暂无推荐用户
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Discover;
