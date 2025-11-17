import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home,
  Search,
  AddCircle,
  Bookmark,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      }}
      elevation={3}
    >
      <MuiBottomNavigation value={getActiveTab()} onChange={handleNavigation}>
        <BottomNavigationAction label="首页" icon={<Home />} />
        <BottomNavigationAction label="发现" icon={<Search />} />
        <BottomNavigationAction
          label="上传"
          icon={<AddCircle sx={{ fontSize: 36, color: 'primary.main' }} />}
        />
        <BottomNavigationAction label="收藏" icon={<Bookmark />} />
        <BottomNavigationAction label="我的" icon={<Person />} />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
