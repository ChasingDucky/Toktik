# 快速设置指南

本指南帮助你快速设置和运行TokTik应用。

## 🚀 使用Docker快速启动（推荐）

### 1. 启动服务

```bash
# 使用启动脚本
./start.sh  # Linux/Mac
# 或
start.bat   # Windows

# 或者直接使用docker-compose
docker-compose up -d
```

### 2. 初始化测试数据

服务启动后，在新终端执行：

```bash
# 进入后端容器
docker-compose exec backend sh

# 运行数据初始化脚本
npm run seed

# 退出容器
exit
```

### 3. 访问应用

- 前端: http://localhost:8666
- 后端API: http://localhost:8667

### 4. 登录测试

使用以下账号登录：
- 邮箱: `demo@toktik.com`
- 密码: `123456`

其他测试账号：
- `travel@toktik.com` / `123456`
- `food@toktik.com` / `123456`
- `tech@toktik.com` / `123456`
- `music@toktik.com` / `123456`

## 💻 本地开发环境

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 2. 启动MongoDB

```bash
mongod
```

### 3. 初始化测试数据

```bash
cd backend
npm run seed
```

### 4. 启动开发服务器

**后端：**
```bash
cd backend
npm run dev
# 运行在 http://localhost:5000
```

**前端：**
```bash
cd frontend
npm run dev
# 运行在 http://localhost:3000
```

### 5. 访问应用

打开浏览器访问 http://localhost:3000

## ❓ 常见问题

### 首页没有视频显示

**原因**: 数据库中没有测试数据

**解决方案**:

1. **Docker环境**:
```bash
docker-compose exec backend npm run seed
```

2. **本地环境**:
```bash
cd backend
npm run seed
```

### 无法连接到后端API

**检查步骤**:

1. 确认后端服务正在运行:
```bash
# Docker
docker-compose ps

# 本地
curl http://localhost:5000/api/health
```

2. 检查端口是否被占用:
```bash
# Linux/Mac
lsof -i :8667
lsof -i :8666

# Windows
netstat -ano | findstr :8667
netstat -ano | findstr :8666
```

3. 查看日志:
```bash
# Docker
docker-compose logs backend

# 本地
# 查看终端输出
```

### MongoDB连接失败

**Docker环境**:
```bash
# 检查MongoDB状态
docker-compose ps mongodb

# 查看MongoDB日志
docker-compose logs mongodb

# 重启MongoDB
docker-compose restart mongodb
```

**本地环境**:
```bash
# 确保MongoDB正在运行
mongod

# 或使用服务管理
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### 视频无法播放

1. **检查视频URL**: 测试数据使用公开的测试视频
2. **网络连接**: 确保可以访问外部URL
3. **浏览器兼容性**: 使用Chrome、Firefox或Safari
4. **上传自己的视频**: 登录后上传本地视频文件

### 端口冲突

**修改端口**:

编辑 `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "9666:8666"  # 使用9666替代8666
  backend:
    ports:
      - "9667:8667"  # 使用9667替代8667
```

## 📊 测试数据说明

运行 `npm run seed` 后会创建：

- **5个测试用户** (demo_user, travel_lover, food_expert, tech_guru, music_fan)
- **8个示例视频** (使用公开测试视频URL)
- **随机评论和点赞**
- **用户关注关系**

## 🎬 上传自己的视频

1. 登录任意测试账号
2. 点击底部导航栏的"+"按钮
3. 选择视频文件（支持MP4、MOV等格式，最大100MB）
4. 填写标题、描述和标签
5. 点击"发布视频"

## 🔄 重置数据

如需清空数据重新开始：

**Docker环境**:
```bash
# 停止并删除所有数据
docker-compose down -v

# 重新启动
docker-compose up -d

# 重新初始化数据
docker-compose exec backend npm run seed
```

**本地环境**:
```bash
# 连接MongoDB
mongosh

# 删除数据库
use toktik
db.dropDatabase()
exit

# 重新运行seed脚本
npm run seed
```

## 🛠️ 开发提示

### 修改代码后重启

**Docker环境**:
```bash
# 重新构建
docker-compose build

# 重启服务
docker-compose up -d
```

**本地环境**:
- 后端使用nodemon，会自动重启
- 前端使用Vite热更新，无需重启

### 查看API文档

访问 http://localhost:8667/api/health 查看API状态

主要API端点：
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/videos/feed` - 获取视频流
- `POST /api/videos` - 上传视频
- `POST /api/videos/:id/like` - 点赞视频

## 📞 获取帮助

遇到其他问题？

1. 查看 [DOCKER.md](./DOCKER.md) 了解详细的Docker部署说明
2. 查看 [README.md](./README.md) 了解项目完整信息
3. 检查日志文件排查错误
4. 在GitHub提交Issue

## 🎉 开始使用

现在你可以：
1. ✅ 浏览视频信息流
2. ✅ 注册/登录账号
3. ✅ 上传视频
4. ✅ 点赞、评论、分享
5. ✅ 关注其他用户
6. ✅ 查看个人主页

享受使用TokTik吧！🚀
