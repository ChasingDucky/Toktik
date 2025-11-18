import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  InputBase,
  alpha,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Search,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationMenu from './NotificationMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { navGlassEffect, inputGlassEffect, menuGlassEffect } from '../utils/glassStyles';

const TopBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const muiTheme = useMuiTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        display: { xs: 'none', md: 'block' },
        ...navGlassEffect(muiTheme),
        color: 'text.primary',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #fe2c55, #00f2ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 4,
          }}
          onClick={() => navigate('/')}
        >
          TokTik
        </Typography>

        {/* 搜索框 */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: 20,
            ...inputGlassEffect(muiTheme),
            marginRight: 2,
            width: { md: '300px', lg: '400px' },
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: muiTheme.palette.mode === 'dark'
                ? '0 4px 20px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <InputBase
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: 'inherit',
              padding: '8px 16px',
              width: '100%',
            }}
          />
          <IconButton type="submit" sx={{ p: '10px' }}>
            <Search />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* 右侧操作按钮 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 语言切换 */}
          <LanguageSwitcher />

          {/* 主题切换 */}
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isAuthenticated ? (
            <>
              {/* 通知 */}
              <NotificationMenu />

              {/* 用户菜单 */}
              <IconButton onClick={handleMenuOpen}>
                <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    ...menuGlassEffect(muiTheme),
                    mt: 1.5,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem onClick={() => { navigate(`/profile/${user._id}`); handleMenuClose(); }}>
                  {t('profile.myProfile')}
                </MenuItem>
                <MenuItem onClick={() => { navigate('/upload'); handleMenuClose(); }}>
                  {t('video.uploadVideo')}
                </MenuItem>
                <MenuItem onClick={() => { navigate('/about'); handleMenuClose(); }}>
                  {t('nav.about')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t('auth.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => navigate('/login')} color="primary">
                {t('auth.login')}
              </IconButton>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
