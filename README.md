# TokTik - 短视频分享平台

一个功能完整的TikTok克隆应用，使用React和Node.js构建，集成了Material Design 3和莫奈取色系统。

## ✨ 特性

### 前端特性
- 🎨 **Material Design 3** - 现代化的UI设计
- 🌈 **莫奈取色系统** - 动态主题配色，从视频中提取颜色
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎬 **沉浸式视频播放** - 竖屏全屏滑动浏览
- ⚡ **流畅的交互** - 使用Framer Motion实现动画效果
- 🌙 **深色/浅色模式** - 支持主题切换

### 后端特性
- 🔐 **JWT认证** - 安全的用户认证系统
- 📹 **视频上传** - 支持多种视频格式
- 💬 **评论系统** - 支持评论和回复
- ❤️ **社交功能** - 点赞、关注、分享
- 🔍 **搜索功能** - 用户和视频搜索
- 📊 **数据统计** - 浏览量、点赞数等统计

## 🛠️ 技术栈

### 前端
- React 18
- Material-UI (MUI) v5
- Material Design 3
- @material/material-color-utilities (莫奈取色)
- React Router v6
- Axios
- Framer Motion
- Zustand (状态管理)
- Vite

### 后端
- Node.js
- Express
- MongoDB + Mongoose
- JWT (身份验证)
- Multer (文件上传)
- Bcryptjs (密码加密)

## 📦 项目结构

```
Toktik/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API路由
│   │   ├── controllers/    # 控制器
│   │   ├── middleware/     # 中间件
│   │   ├── config/         # 配置文件
│   │   ├── utils/          # 工具函数
│   │   └── server.js       # 主服务器文件
│   ├── uploads/            # 上传文件存储
│   └── package.json
│
└── frontend/               # 前端应用
    ├── src/
    │   ├── components/     # React组件
    │   ├── pages/          # 页面组件
    │   ├── context/        # Context API
    │   ├── services/       # API服务
    │   ├── utils/          # 工具函数
    │   ├── App.jsx         # 主应用
    │   └── main.jsx        # 入口文件
    ├── public/             # 静态资源
    └── package.json
```

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm 或 yarn

### 安装

1. 克隆项目
```bash
git clone <repository-url>
cd Toktik
```

2. 安装后端依赖
```bash
cd backend
npm install
```

3. 配置后端环境变量
```bash
cp .env.example .env
# 编辑.env文件，设置你的配置
```

4. 安装前端依赖
```bash
cd ../frontend
npm install
```

### 运行

1. 启动MongoDB
```bash
mongod
```

2. 启动后端服务
```bash
cd backend
npm run dev
```
后端将在 http://localhost:5000 运行

3. 启动前端开发服务器
```bash
cd frontend
npm run dev
```
前端将在 http://localhost:3000 运行

## 🎨 Material You 莫奈取色系统

本项目集成了Google的Material You设计系统中的莫奈取色算法：

### 功能特点
- 🎨 **自动提取颜色** - 从视频缩略图或用户头像中提取主色调
- 🌈 **动态主题生成** - 基于提取的颜色生成完整的色彩方案
- 🔄 **无缝切换** - 支持深色/浅色模式切换
- 💫 **Material Design 3** - 完全符合MD3设计规范

### 使用示例
```javascript
import { useTheme } from './context/ThemeContext';

const MyComponent = () => {
  const { updateThemeFromImage, updateThemeFromColor } = useTheme();

  // 从图片更新主题
  await updateThemeFromImage(imageUrl);

  // 从RGB颜色更新主题
  updateThemeFromColor(255, 100, 150);
};
```

## 📱 核心功能

### 用户功能
- ✅ 用户注册/登录
- ✅ 个人资料编辑
- ✅ 关注/取消关注用户
- ✅ 查看用户主页

### 视频功能
- ✅ 视频上传（支持多种格式）
- ✅ 视频播放（自动播放、循环播放）
- ✅ 竖屏滑动浏览
- ✅ 点赞/取消点赞
- ✅ 评论/回复
- ✅ 分享视频
- ✅ 视频标签

### 发现功能
- ✅ 视频信息流
- ✅ 热门视频推荐
- ✅ 标签浏览
- ✅ 用户搜索

## 🔒 API端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 视频
- `GET /api/videos/feed` - 获取视频流
- `GET /api/videos/:id` - 获取单个视频
- `POST /api/videos` - 上传视频
- `POST /api/videos/:id/like` - 点赞/取消点赞
- `DELETE /api/videos/:id` - 删除视频

### 用户
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/profile` - 更新个人资料
- `POST /api/users/:id/follow` - 关注/取消关注
- `GET /api/users/search` - 搜索用户

### 评论
- `GET /api/videos/:videoId/comments` - 获取评论列表
- `POST /api/videos/:videoId/comments` - 添加评论
- `POST /api/comments/:id/like` - 点赞评论
- `DELETE /api/comments/:id` - 删除评论

## 🎯 环境变量

### 后端环境变量 (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/toktik
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
MAX_FILE_SIZE=104857600
```

### 前端环境变量 (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📝 许可证

本项目采用 MIT 许可证

## 👨‍💻 作者

TokTik Team

## 🙏 致谢

- Material Design团队提供的优秀设计系统
- TikTok的设计灵感
- 所有开源贡献者
