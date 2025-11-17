# ⚡ 5分钟快速开始

欢迎使用TokTik！这是一个功能完整的TikTok克隆应用。

## 🚀 超快速启动（推荐）

### 一键启动脚本

**Linux/Mac:**
```bash
./quick-start.sh
```

**Windows:**
```cmd
quick-start.bat
```

脚本会自动：
- ✅ 启动所有Docker服务
- ✅ 等待服务就绪
- ✅ 自动初始化8个测试视频
- ✅ 显示访问地址和测试账号

### 手动启动

```bash
# 1. 启动服务
docker-compose up -d

# 2. 等待30-60秒让服务完全启动
# 后端会自动检测并初始化测试数据

# 3. 访问应用
# 浏览器打开: http://localhost:8666
```

## 🎯 访问应用

- **前端**: http://localhost:8666
- **后端API**: http://localhost:8667

## 🎬 测试账号

```
邮箱: demo@toktik.com
密码: 123456
```

其他测试账号：
- travel@toktik.com / 123456
- food@toktik.com / 123456
- tech@toktik.com / 123456
- music@toktik.com / 123456

## 📺 应该看到什么？

启动成功后，首页应该显示：
- ✅ 8个测试视频（竖屏滑动浏览）
- ✅ 视频自动播放
- ✅ 可以点赞、评论、分享
- ✅ 完整的用户界面

## ❓ 如果首页是空的？

**情况1: 正在初始化**
- 首次启动需要30-60秒初始化数据
- 请等待片刻后刷新页面

**情况2: 数据未自动初始化**
手动初始化：
```bash
docker-compose exec backend npm run seed
```

**情况3: 看到"暂无视频"提示**
- 这是正常的空状态界面
- 点击页面上的"刷新"按钮
- 或运行上面的手动初始化命令

## 🎮 开始体验

1. **浏览视频** - 上下滑动切换视频
2. **点赞** - 点击右侧爱心图标
3. **评论** - 点击评论图标
4. **登录** - 使用测试账号登录
5. **上传** - 点击底部"+"按钮上传视频

## 📱 功能特性

- 🎬 TikTok风格的竖屏视频播放
- 🌈 Material Design 3 + 莫奈取色
- ❤️ 点赞、评论、分享
- 👥 关注用户
- 📤 上传视频
- 🔍 搜索功能

## 🛠️ 常用命令

```bash
# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 完全清理并重启
docker-compose down -v
docker-compose up -d
```

## 📚 更多文档

- [README.md](./README.md) - 完整的项目文档
- [SETUP.md](./SETUP.md) - 详细设置指南
- [DOCKER.md](./DOCKER.md) - Docker部署文档

## 🆘 遇到问题？

### 端口被占用
修改 `docker-compose.yml` 中的端口：
```yaml
ports:
  - "9666:8666"  # 改用9666端口
```

### 服务启动失败
```bash
# 查看日志
docker-compose logs

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 视频无法播放
1. 检查网络连接
2. 尝试上传本地视频
3. 查看浏览器控制台错误

## 💡 开发提示

- **后端**: Node.js + Express + MongoDB
- **前端**: React + Vite + Material-UI
- **端口**: 8666 (前端), 8667 (后端)
- **数据**: 自动持久化到Docker卷

## 🎉 现在开始！

打开浏览器访问 http://localhost:8666 开始体验TokTik！

---

**需要帮助？** 查看 [SETUP.md](./SETUP.md) 获取详细指南
