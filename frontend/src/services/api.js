import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// 视频API
export const videoAPI = {
  getFeed: (page = 1, limit = 10) =>
    api.get(`/videos/feed?page=${page}&limit=${limit}`),
  getVideo: (id) => api.get(`/videos/${id}`),
  getUserVideos: (userId) => api.get(`/videos/user/${userId}`),
  uploadVideo: (formData) =>
    api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
};

// 评论API
export const commentAPI = {
  getComments: (videoId) => api.get(`/videos/${videoId}/comments`),
  addComment: (videoId, text, parentCommentId = null) =>
    api.post(`/videos/${videoId}/comments`, { text, parentCommentId }),
  likeComment: (id) => api.post(`/comments/${id}/like`),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// 用户API
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: (passwordData) => api.put('/users/password', passwordData),
  followUser: (id) => api.post(`/users/${id}/follow`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
};

// 发现API
export const discoverAPI = {
  getTrending: (page = 1, limit = 20) =>
    api.get(`/discover/trending?page=${page}&limit=${limit}`),
  getAllTags: () => api.get('/discover/tags'),
  getVideosByTag: (tag, page = 1, limit = 20) =>
    api.get(`/discover/tags/${tag}?page=${page}&limit=${limit}`),
  getRecommendedUsers: (limit = 10) =>
    api.get(`/discover/users?limit=${limit}`),
  search: (query, type = 'all', page = 1, limit = 20) =>
    api.get(`/discover/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`),
};

// 通知API
export const notificationAPI = {
  getNotifications: (page = 1, limit = 20) =>
    api.get(`/notifications?page=${page}&limit=${limit}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
