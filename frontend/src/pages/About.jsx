import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  VideoLibrary,
  People,
  Favorite,
  Search,
  Notifications,
  Bookmark,
  TrendingUp,
  Security,
  Speed,
  Palette,
  CloudUpload,
  CheckCircle,
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <VideoLibrary />,
      title: '视频分享',
      description: '上传和分享你的精彩瞬间',
    },
    {
      icon: <People />,
      title: '社交互动',
      description: '关注用户、点赞评论、建立连接',
    },
    {
      icon: <Favorite />,
      title: '点赞系统',
      description: '为喜欢的内容点赞',
    },
    {
      icon: <Search />,
      title: '智能搜索',
      description: '快速找到感兴趣的视频和用户',
    },
    {
      icon: <Notifications />,
      title: '实时通知',
      description: '及时了解互动动态',
    },
    {
      icon: <Bookmark />,
      title: '视频收藏',
      description: '保存喜欢的内容随时观看',
    },
    {
      icon: <TrendingUp />,
      title: '发现热门',
      description: '探索热门视频和标签',
    },
    {
      icon: <Palette />,
      title: 'Material You',
      description: '动态主题色彩系统',
    },
  ];

  const techStack = [
    { category: '前端', items: ['React 18', 'Material-UI 5', 'Vite', 'Material Design 3'] },
    { category: '后端', items: ['Node.js', 'Express', 'MongoDB', 'JWT'] },
    { category: '特性', items: ['响应式设计', 'PWA 就绪', 'Material You', 'RESTful API'] },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #fe2c55, #00f2ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          TokTik
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          新一代短视频分享平台
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
          TokTik 是一个功能完整的短视频分享平台，采用现代化技术栈构建，
          提供流畅的用户体验和丰富的社交功能。
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Chip label="开源" color="primary" sx={{ mr: 1 }} />
          <Chip label="现代化" color="secondary" sx={{ mr: 1 }} />
          <Chip label="高性能" color="success" />
        </Box>
      </Box>

      {/* Features Grid */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          核心功能
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Tech Stack */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          技术栈
        </Typography>
        <Grid container spacing={3}>
          {techStack.map((tech, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    {tech.category}
                  </Typography>
                  <List dense>
                    {tech.items.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Statistics */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
          平台特性
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box>
              <Security sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                安全可靠
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JWT 认证保护
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <Speed sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                高性能
              </Typography>
              <Typography variant="body2" color="text.secondary">
                优化的加载速度
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <Palette sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Material You
              </Typography>
              <Typography variant="body2" color="text.secondary">
                动态主题色彩
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <CloudUpload sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                易用上传
              </Typography>
              <Typography variant="body2" color="text.secondary">
                简单快捷分享
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Contact/Info */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          联系我们
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          如有问题或建议，欢迎通过以下方式联系我们：
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link href="mailto:support@toktik.com" sx={{ mr: 3 }}>
            support@toktik.com
          </Link>
          <Link href="https://github.com/toktik" target="_blank" rel="noopener">
            GitHub
          </Link>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
          © 2025 TokTik. 版本 v1.0.0
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
