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
- 🔔 **实时通知系统** - 30秒自动轮询，即时获取互动消息
- 🔖 **视频收藏功能** - 保存喜欢的内容随时观看
- 💡 **Toast通知提示** - 友好的操作反馈

### 后端特性
- 🔐 **JWT认证** - 安全的用户认证系统
- 📹 **视频上传** - 支持多种视频格式
- 💬 **评论系统** - 支持评论和回复
- ❤️ **社交功能** - 点赞、关注、分享
- 🔍 **搜索功能** - 用户和视频搜索
- 📊 **数据统计** - 浏览量、点赞数等统计
- 🔔 **通知系统** - 点赞、评论、关注、回复通知
- 🔖 **收藏管理** - 视频收藏和管理功能

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
- Nginx (生产环境)

### 后端
- Node.js
- Express
- MongoDB + Mongoose
- JWT (身份验证)
- Multer (文件上传)
- Bcryptjs (密码加密)

### DevOps
- Docker
- Docker Compose
- Nginx反向代理

## 📦 项目结构

```
Toktik/
├── docker-compose.yml       # Docker编排配置
├── backend/                 # 后端服务
│   ├── Dockerfile          # 后端Docker配置
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
    ├── Dockerfile          # 前端Docker配置
    ├── nginx.conf          # Nginx配置
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

### 方式一：使用 Docker（推荐）🐳

**前置要求：**
- Docker >= 20.10
- Docker Compose >= 2.0

**一键启动：**
```bash
# 克隆项目
git clone <repository-url>
cd Toktik

# 使用Docker Compose启动所有服务
docker-compose up -d
```

**访问应用：**
- 前端: http://localhost:8666
- 后端API: http://localhost:8667
- MongoDB: localhost:27017

**常用命令：**
```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止服务并删除数据卷
docker-compose down -v

# 重新构建镜像
docker-compose build

# 重启服务
docker-compose restart
```

**端口说明：**
- `8666` - 前端Web服务
- `8667` - 后端API服务
- `27017` - MongoDB数据库

### 方式二：本地开发环境

**前置要求：**
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm 或 yarn

**安装步骤：**

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

**运行步骤：**

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
- ✅ 个人资料编辑（头像、用户名、简介）
- ✅ 密码修改
- ✅ 关注/取消关注用户
- ✅ 查看用户主页
- ✅ 粉丝/关注列表

### 视频功能
- ✅ 视频上传（支持多种格式）
- ✅ 视频播放（自动播放、循环播放）
- ✅ 竖屏滑动浏览
- ✅ 点赞/取消点赞
- ✅ 收藏/取消收藏
- ✅ 评论/回复
- ✅ 分享视频（原生API + 复制链接）
- ✅ 视频标签
- ✅ 视频删除

### 发现功能
- ✅ 视频信息流
- ✅ 热门视频推荐
- ✅ 热门标签
- ✅ 推荐用户
- ✅ 全局搜索（视频+用户）
- ✅ 标签分类浏览

### 通知功能
- ✅ 点赞通知
- ✅ 评论通知
- ✅ 回复通知
- ✅ 关注通知
- ✅ 实时未读数徽章
- ✅ 自动30秒轮询
- ✅ 标记已读/全部已读
- ✅ 删除通知

### 收藏功能
- ✅ 收藏视频
- ✅ 收藏列表页面
- ✅ 取消收藏
- ✅ 收藏数量统计

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

### 通知
- `GET /api/notifications` - 获取通知列表
- `GET /api/notifications/unread-count` - 获取未读数量
- `PUT /api/notifications/:id/read` - 标记为已读
- `PUT /api/notifications/read-all` - 全部标记为已读
- `DELETE /api/notifications/:id` - 删除通知

### 收藏
- `POST /api/videos/:id/bookmark` - 收藏/取消收藏视频
- `GET /api/videos/favorites` - 获取收藏列表

## 🎯 环境变量

### 后端环境变量 (.env)
```env
PORT=5000                                      # 本地开发端口
MONGODB_URI=mongodb://localhost:27017/toktik  # 数据库连接
JWT_SECRET=your_jwt_secret_key                 # JWT密钥
JWT_EXPIRE=7d                                  # Token过期时间
NODE_ENV=development                           # 环境模式
MAX_FILE_SIZE=104857600                        # 最大文件大小(100MB)
```

### 前端环境变量 (.env)
```env
VITE_API_URL=http://localhost:5000/api        # 本地开发API地址
```

### Docker环境变量
Docker部署时会自动使用以下配置：
- 前端端口: `8666`
- 后端端口: `8667`
- MongoDB: 内部网络连接

可以通过修改 `docker-compose.yml` 文件来自定义配置。

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
