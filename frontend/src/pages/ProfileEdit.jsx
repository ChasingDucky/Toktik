import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  PhotoCamera,
  Save,
  Lock,
} from '@mui/icons-material';
import { userAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        bio: user.bio || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', profileForm.username);
      formData.append('bio', profileForm.bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await userAPI.updateProfile(formData);

      // Update user in AuthContext
      updateUser(response.data);

      setSnackbar({
        open: true,
        message: '个人资料更新成功',
        severity: 'success',
      });

      // Navigate back to profile after a delay
      setTimeout(() => {
        navigate(`/profile/${user._id}`);
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || '更新失败，请重试',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate passwords
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新密码至少需要6个字符');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('新密码与确认密码不匹配');
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setSnackbar({
        open: true,
        message: '密码修改成功',
        severity: 'success',
      });

      setPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || '密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          编辑资料
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarPreview}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid',
                borderColor: 'primary.main',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              component="label"
            >
              <PhotoCamera />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarChange}
              />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            点击相机图标更换头像
          </Typography>
        </Box>

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit}>
          <TextField
            fullWidth
            label="用户名"
            value={profileForm.username}
            onChange={(e) =>
              setProfileForm({ ...profileForm, username: e.target.value })
            }
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="个人简介"
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm({ ...profileForm, bio: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
            placeholder="介绍一下自己..."
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? '保存中...' : '保存更改'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        {/* Password Change Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Lock />}
          onClick={() => setPasswordDialogOpen(true)}
        >
          修改密码
        </Button>
      </Paper>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => !loading && setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>修改密码</DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="当前密码"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              type="password"
              label="新密码"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              margin="normal"
              required
              disabled={loading}
              helperText="至少6个字符"
            />

            <TextField
              fullWidth
              type="password"
              label="确认新密码"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              margin="normal"
              required
              disabled={loading}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setPasswordDialogOpen(false)} disabled={loading}>
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? '修改中...' : '确认修改'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileEdit;
