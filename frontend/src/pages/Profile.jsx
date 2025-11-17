import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Edit,
  Favorite,
} from '@mui/icons-material';
import { userAPI, videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [following, setFollowing] = useState(false);
  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId);
      setProfile(response.data.user);
      setVideos(response.data.videos);

      if (currentUser && response.data.user.followers?.includes(currentUser._id)) {
        setFollowing(true);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) return;

    try {
      await userAPI.followUser(userId);
      setFollowing(!following);
      loadProfile();
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
          用户不存在
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 用户信息头部 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 4,
          mb: 4,
        }}
      >
        <Avatar
          src={profile.avatar}
          sx={{ width: 150, height: 150, border: '4px solid', borderColor: 'primary.main' }}
        />

        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {profile.username}
          </Typography>

          {profile.bio && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {profile.bio}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 3, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {profile.followers?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                粉丝
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {profile.following?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                关注
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {videos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                视频
              </Typography>
            </Box>
          </Box>

          {isOwnProfile ? (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate('/profile/edit')}
            >
              编辑资料
            </Button>
          ) : (
            <Button
              variant={following ? 'outlined' : 'contained'}
              startIcon={following ? <PersonRemove /> : <PersonAdd />}
              onClick={handleFollow}
            >
              {following ? '取消关注' : '关注'}
            </Button>
          )}
        </Box>
      </Box>

      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="视频" />
          <Tab label="喜欢" />
        </Tabs>
      </Box>

      {/* 视频网格 */}
      <Grid container spacing={2}>
        {videos.map((video) => (
          <Grid item xs={6} sm={4} md={3} key={video._id}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'transform 0.2s',
              }}
              onClick={() => (window.location.href = `/video/${video._id}`)}
            >
              <CardMedia
                component="video"
                src={video.videoUrl}
                sx={{ aspectRatio: '9/16' }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" noWrap>
                  {video.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                  <Typography variant="caption">
                    {video.likes?.length || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {videos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            还没有发布视频
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
