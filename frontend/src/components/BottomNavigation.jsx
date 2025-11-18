import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import {
  Home,
  Search,
  AddCircle,
  Bookmark,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { navGlassEffect } from '../utils/glassStyles';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/discover') return 1;
    if (path === '/upload') return 2;
    if (path === '/favorites') return 3;
    if (path.startsWith('/profile')) return 4;
    return 0;
  };

  const handleNavigation = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/discover');
        break;
      case 2:
        if (isAuthenticated) {
          navigate('/upload');
        } else {
          navigate('/login');
        }
        break;
      case 3:
        if (isAuthenticated) {
          navigate('/favorites');
        } else {
          navigate('/login');
        }
        break;
      case 4:
        if (isAuthenticated) {
          navigate(`/profile/${user._id}`);
        } else {
          navigate('/login');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        ...navGlassEffect(theme),
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        borderRadius: 0,
      }}
      elevation={0}
    >
      <MuiBottomNavigation value={getActiveTab()} onChange={handleNavigation}>
        <BottomNavigationAction label={t('nav.home')} icon={<Home />} />
        <BottomNavigationAction label={t('nav.discover')} icon={<Search />} />
        <BottomNavigationAction
          label={t('nav.upload')}
          icon={<AddCircle sx={{ fontSize: 36, color: 'primary.main' }} />}
        />
        <BottomNavigationAction label={t('nav.favorites')} icon={<Bookmark />} />
        <BottomNavigationAction label={t('nav.profile')} icon={<Person />} />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
