import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  VideoLibrary,
  Close,
  MusicNote,
} from '@mui/icons-material';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [musicName, setMusicName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      setError('请选择视频文件');
      return;
    }

    // 验证文件大小 (最大100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('视频文件大小不能超过100MB');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError('请选择要上传的视频');
      return;
    }

    if (!title.trim()) {
      setError('请输入视频标题');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('tags', tags);
    if (musicName.trim()) {
      formData.append('musicName', musicName.trim());
    }

    try {
      await videoAPI.uploadVideo(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '上传失败，请重试');
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          上传视频
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          分享你的精彩瞬间
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* 视频上传区域 */}
          {!videoFile ? (
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <VideoLibrary sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                点击或拖拽上传视频
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持MP4、MOV等格式，最大100MB
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
          ) : (
            <Box sx={{ position: 'relative', mb: 3 }}>
              <video
                src={videoPreview}
                controls
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                }}
              />
              <IconButton
                onClick={handleRemoveVideo}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                  },
                }}
              >
                <Close />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            </Box>
          )}

          {/* 视频信息 */}
          <TextField
            fullWidth
            label="视频标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            inputProps={{ maxLength: 150 }}
            helperText={`${title.length}/150`}
          />

          <TextField
            fullWidth
            label="视频描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
            helperText={`${description.length}/500`}
          />

          <TextField
            fullWidth
            label="标签 (用逗号分隔)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            placeholder="例如: 搞笑, 美食, 旅游"
            helperText="添加标签可以让更多人发现你的视频"
          />

          <TextField
            fullWidth
            label="背景音乐"
            value={musicName}
            onChange={(e) => setMusicName(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: <MusicNote sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            placeholder="输入音乐名称（选填）"
          />

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="indeterminate" />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                正在上传...
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={uploading || !videoFile}
            startIcon={<CloudUpload />}
            sx={{ mt: 3, py: 1.5 }}
          >
            {uploading ? '上传中...' : '发布视频'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Upload;
