import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close,
  PlayArrow,
  Favorite,
  Visibility,
} from '@mui/icons-material';
import { discoverAPI, userAPI } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tabValue, setTabValue] = useState(0);
  const [results, setResults] = useState({ videos: null, users: null });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);

      const type = tabValue === 0 ? 'all' : tabValue === 1 ? 'videos' : 'users';
      const response = await discoverAPI.search(searchQuery, type);

      setResults(response.results || {});
      setSearchParams({ q: searchQuery });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults({ videos: null, users: null });
    setSearched(false);
    setSearchParams({});
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFollow = async (userId) => {
    try {
      await userAPI.followUser(userId);
      // 重新搜索以更新数据
      handleSearch();
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 搜索框 */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="搜索视频、用户..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end">
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 50,
              paddingRight: 1,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={() => handleSearch()}
          disabled={!query.trim()}
          sx={{ mt: 2 }}
          fullWidth
        >
          搜索
        </Button>
      </Box>

      {/* 加载中 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#fe2c55' }} />
        </Box>
      )}

      {/* 搜索结果 */}
      {!loading && searched && (
        <>
          {/* 标签页 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => {
                setTabValue(v);
                handleSearch();
              }}
            >
              <Tab label="全部" />
              <Tab label="视频" />
              <Tab label="用户" />
            </Tabs>
          </Box>

          {/* 视频结果 */}
          {(tabValue === 0 || tabValue === 1) && results.videos && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                视频 ({results.videos.total || 0})
              </Typography>
              <Grid container spacing={2}>
                {results.videos.data && results.videos.data.length > 0 ? (
                  results.videos.data.map((video) => (
                    <Grid item xs={6} sm={4} md={3} key={video._id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s',
                          },
                        }}
                        onClick={() => handleVideoClick(video._id)}
                      >
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Avatar src={video.user?.avatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="caption" noWrap>
                              {video.user?.username}
                            </Typography>
                          </Box>
                          <Typography variant="body2" noWrap sx={{ mb: 1, fontWeight: 500 }}>
                            {video.title}
                          </Typography>
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
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      没有找到相关视频
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* 用户结果 */}
          {(tabValue === 0 || tabValue === 2) && results.users && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                用户 ({results.users.total || 0})
              </Typography>
              <Grid container spacing={2}>
                {results.users.data && results.users.data.length > 0 ? (
                  results.users.data.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                      <Card
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => handleUserClick(user._id)}
                      >
                        <Avatar src={user.avatar} sx={{ width: 60, height: 60 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {user.username}
                            {user.verified && ' ✓'}
                          </Typography>
                          {user.bio && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.bio}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {user.followers?.length || 0} 粉丝
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      没有找到相关用户
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* 无结果 */}
          {!results.videos && !results.users && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                没有找到结果
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                尝试使用其他关键词搜索
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* 初始状态 */}
      {!loading && !searched && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            搜索视频和用户
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            输入关键词开始搜索
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Search;
