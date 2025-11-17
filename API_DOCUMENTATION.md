# TokTik API Documentation

完整的TokTik平台RESTful API文档

## 基础信息

- **Base URL**: `http://localhost:8667/api`
- **Content-Type**: `application/json`
- **Authorization**: Bearer Token (JWT)

## 认证 (Authentication)

### 注册用户
```http
POST /auth/register
```

**请求体**:
```json
{
  "username": "string (3-30字符)",
  "email": "string (有效邮箱)",
  "password": "string (至少6字符)"
}
```

**响应** (201):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "_id": "507f1f77bcf86cd799439011",
  "username": "demo",
  "email": "demo@toktik.com",
  "avatar": "https://via.placeholder.com/150"
}
```

### 登录
```http
POST /auth/login
```

**请求体**:
```json
{
  "email": "demo@toktik.com",
  "password": "123456"
}
```

**响应** (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "_id": "507f1f77bcf86cd799439011",
  "username": "demo",
  "email": "demo@toktik.com",
  "avatar": "https://via.placeholder.com/150"
}
```

### 获取当前用户
```http
GET /auth/me
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "_id": "507f1f77bcf86cd799439011",
  "username": "demo",
  "email": "demo@toktik.com",
  "avatar": "https://via.placeholder.com/150",
  "bio": "我的个人简介",
  "followers": [],
  "following": [],
  "verified": false
}
```

---

## 视频 (Videos)

### 获取视频流
```http
GET /videos/feed?page=1&limit=10
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "视频标题",
      "description": "视频描述",
      "videoUrl": "/uploads/videos/video.mp4",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "demo",
        "avatar": "https://...",
        "verified": false
      },
      "likes": [],
      "comments": [],
      "views": 100,
      "tags": ["搞笑", "日常"],
      "musicName": "背景音乐",
      "createdAt": "2025-01-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### 获取单个视频
```http
GET /videos/:id
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "视频标题",
    "description": "视频描述",
    "videoUrl": "/uploads/videos/video.mp4",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "demo",
      "avatar": "https://...",
      "verified": false,
      "followers": []
    },
    "likes": [],
    "comments": [],
    "views": 101,
    "tags": ["搞笑", "日常"],
    "musicName": "背景音乐",
    "createdAt": "2025-01-17T10:00:00.000Z"
  }
}
```

### 上传视频
```http
POST /videos
```

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体** (FormData):
- `video`: File (视频文件)
- `title`: string (必需)
- `description`: string (可选)
- `tags`: string (逗号分隔，可选)
- `musicName`: string (可选)

**响应** (201):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "我的视频",
    "description": "这是描述",
    "videoUrl": "/uploads/videos/1234567890.mp4",
    "user": "507f1f77bcf86cd799439012",
    "tags": ["搞笑", "日常"],
    "musicName": "背景音乐",
    "likes": [],
    "comments": [],
    "views": 0,
    "isPublic": true,
    "createdAt": "2025-01-17T10:00:00.000Z"
  }
}
```

### 点赞/取消点赞视频
```http
POST /videos/:id/like
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 101
  }
}
```

### 收藏/取消收藏视频
```http
POST /videos/:id/bookmark
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "bookmarked": true,
    "message": "Added to favorites"
  }
}
```

### 获取收藏列表
```http
GET /videos/favorites
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "收藏的视频",
      "videoUrl": "/uploads/videos/video.mp4",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "demo",
        "avatar": "https://...",
        "verified": false
      },
      "likes": [],
      "views": 100,
      "createdAt": "2025-01-17T10:00:00.000Z"
    }
  ]
}
```

### 删除视频
```http
DELETE /videos/:id
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## 评论 (Comments)

### 获取视频评论
```http
GET /videos/:videoId/comments
```

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "text": "这个视频太棒了！",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "demo",
        "avatar": "https://...",
        "verified": false
      },
      "video": "507f1f77bcf86cd799439013",
      "parentComment": null,
      "replies": [],
      "likes": [],
      "createdAt": "2025-01-17T10:00:00.000Z"
    }
  ]
}
```

### 添加评论
```http
POST /videos/:videoId/comments
```

**Headers**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "text": "这是我的评论",
  "parentCommentId": "507f1f77bcf86cd799439011" // 可选，回复评论时提供
}
```

**响应** (201):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "text": "这是我的评论",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "demo",
      "avatar": "https://..."
    },
    "video": "507f1f77bcf86cd799439013",
    "parentComment": null,
    "replies": [],
    "likes": [],
    "createdAt": "2025-01-17T10:00:00.000Z"
  }
}
```

### 点赞/取消点赞评论
```http
POST /comments/:id/like
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 10
  }
}
```

### 删除评论
```http
DELETE /comments/:id
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## 用户 (Users)

### 获取用户资料
```http
GET /users/:id
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "demo",
      "email": "demo@toktik.com",
      "avatar": "https://...",
      "bio": "我的个人简介",
      "followers": [],
      "following": [],
      "verified": false,
      "createdAt": "2025-01-17T10:00:00.000Z"
    },
    "videos": [],
    "stats": {
      "followers": 100,
      "following": 50,
      "videos": 25
    }
  }
}
```

### 更新个人资料
```http
PUT /users/profile
```

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求体** (FormData):
- `username`: string (可选)
- `bio`: string (可选)
- `avatar`: File (可选，头像图片)

**响应** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "new_username",
    "email": "demo@toktik.com",
    "avatar": "/uploads/avatars/avatar.jpg",
    "bio": "更新后的简介"
  }
}
```

### 修改密码
```http
PUT /users/password
```

**Headers**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "currentPassword": "old123456",
  "newPassword": "new123456"
}
```

**响应** (200):
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 关注/取消关注用户
```http
POST /users/:id/follow
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "following": true,
    "followerCount": 101
  }
}
```

### 搜索用户
```http
GET /users/search?q=demo
```

**查询参数**:
- `q`: 搜索关键词

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "demo",
      "avatar": "https://...",
      "bio": "我的个人简介",
      "verified": false
    }
  ]
}
```

---

## 发现 (Discover)

### 获取热门视频
```http
GET /discover/trending?page=1&limit=20
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "热门视频",
      "videoUrl": "/uploads/videos/video.mp4",
      "user": {
        "username": "demo",
        "avatar": "https://..."
      },
      "likes": [],
      "views": 10000,
      "createdAt": "2025-01-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 获取所有标签
```http
GET /discover/tags
```

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "搞笑",
      "count": 50
    },
    {
      "_id": "日常",
      "count": 30
    }
  ]
}
```

### 按标签获取视频
```http
GET /discover/tags/:tag?page=1&limit=20
```

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "搞笑视频",
      "tags": ["搞笑"],
      "videoUrl": "/uploads/videos/video.mp4",
      "user": {
        "username": "demo"
      }
    }
  ]
}
```

### 获取推荐用户
```http
GET /discover/users?limit=10
```

**查询参数**:
- `limit`: 返回数量 (默认: 10)

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "popular_user",
      "avatar": "https://...",
      "bio": "热门用户",
      "verified": true,
      "followerCount": 1000
    }
  ]
}
```

### 搜索
```http
GET /discover/search?q=关键词&type=all&page=1&limit=20
```

**查询参数**:
- `q`: 搜索关键词 (必需)
- `type`: 类型 (all, videos, users) (默认: all)
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

**响应** (200):
```json
{
  "success": true,
  "data": {
    "videos": [],
    "users": []
  }
}
```

---

## 通知 (Notifications)

### 获取通知列表
```http
GET /notifications?page=1&limit=20
```

**Headers**:
```
Authorization: Bearer {token}
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

**响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "recipient": "507f1f77bcf86cd799439012",
      "sender": {
        "_id": "507f1f77bcf86cd799439013",
        "username": "alice",
        "avatar": "https://...",
        "verified": false
      },
      "type": "like",
      "video": {
        "_id": "507f1f77bcf86cd799439014",
        "title": "我的视频",
        "videoUrl": "/uploads/videos/video.mp4"
      },
      "read": false,
      "createdAt": "2025-01-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  },
  "unreadCount": 15
}
```

### 获取未读数量
```http
GET /notifications/unread-count
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "count": 15
  }
}
```

### 标记通知为已读
```http
PUT /notifications/:id/read
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "read": true,
    "createdAt": "2025-01-17T10:00:00.000Z"
  }
}
```

### 标记所有通知为已读
```http
PUT /notifications/read-all
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 删除通知
```http
DELETE /notifications/:id
```

**Headers**:
```
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## 错误响应

所有API端点在出错时返回以下格式：

```json
{
  "success": false,
  "message": "错误描述"
}
```

### 常见错误码

| 状态码 | 说明 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或token无效） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 数据模型

### User
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string (hashed),
  avatar: string,
  bio: string?,
  followers: ObjectId[],
  following: ObjectId[],
  likedVideos: ObjectId[],
  favoriteVideos: ObjectId[],
  verified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Video
```typescript
{
  _id: ObjectId,
  title: string,
  description: string?,
  videoUrl: string,
  thumbnail: string?,
  user: ObjectId,
  likes: ObjectId[],
  comments: ObjectId[],
  views: number,
  tags: string[],
  musicName: string?,
  isPublic: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```typescript
{
  _id: ObjectId,
  text: string,
  user: ObjectId,
  video: ObjectId,
  parentComment: ObjectId?,
  replies: ObjectId[],
  likes: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```typescript
{
  _id: ObjectId,
  recipient: ObjectId,
  sender: ObjectId,
  type: 'like' | 'comment' | 'follow' | 'reply',
  video: ObjectId?,
  comment: ObjectId?,
  text: string?,
  read: boolean,
  createdAt: Date
}
```

---

## 速率限制

目前暂无速率限制，建议合理使用API。

---

## 健康检查

```http
GET /api/health
```

**响应** (200):
```json
{
  "success": true,
  "message": "TokTik API is running",
  "timestamp": "2025-01-17T10:00:00.000Z"
}
```

---

**API 版本**: v1.0.0
**最后更新**: 2025-01-17
