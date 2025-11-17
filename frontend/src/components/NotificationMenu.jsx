import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Box,
  Typography,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Favorite,
  Comment,
  PersonAdd,
  Reply,
  Delete,
  DoneAll,
} from '@mui/icons-material';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications(1, 10);
      setNotifications(response.data);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    handleClose();

    // Navigate based on notification type
    if (notification.type === 'like' || notification.type === 'comment') {
      navigate(`/video/${notification.video?._id}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.sender?._id}`);
    } else if (notification.type === 'reply') {
      navigate(`/video/${notification.video?._id}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Favorite sx={{ color: 'error.main' }} />;
      case 'comment':
        return <Comment sx={{ color: 'primary.main' }} />;
      case 'follow':
        return <PersonAdd sx={{ color: 'success.main' }} />;
      case 'reply':
        return <Reply sx={{ color: 'info.main' }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationText = (notification) => {
    const username = notification.sender?.username || '未知用户';
    switch (notification.type) {
      case 'like':
        return `${username} 赞了你的视频`;
      case 'comment':
        return `${username} 评论了你的视频: ${notification.text || ''}`;
      case 'follow':
        return `${username} 关注了你`;
      case 'reply':
        return `${username} 回复了你: ${notification.text || ''}`;
      default:
        return '新通知';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`;
    return new Date(date).toLocaleDateString('zh-CN');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 500,
            width: 360,
            overflow: 'auto',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            通知
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={handleMarkAllAsRead}
            >
              全部已读
            </Button>
          )}
        </Box>
        <Divider />

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': {
                  backgroundColor: notification.read ? 'action.hover' : 'action.selected',
                },
                py: 1.5,
              }}
            >
              <ListItemIcon>
                <Avatar src={notification.sender?.avatar} sx={{ width: 40, height: 40 }}>
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {getNotificationText(notification)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(notification._id, e)}
                      sx={{ mt: -0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {getTimeAgo(notification.createdAt)}
                  </Typography>
                }
              />
            </MenuItem>
          ))
        ) : (
          !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                暂无通知
              </Typography>
            </Box>
          )
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
