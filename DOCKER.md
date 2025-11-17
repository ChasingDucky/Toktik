# Docker 部署指南

本文档详细介绍如何使用Docker部署TokTik应用。

## 📋 目录
- [快速开始](#快速开始)
- [详细说明](#详细说明)
- [服务架构](#服务架构)
- [常见问题](#常见问题)
- [高级配置](#高级配置)

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### 方式二：使用Docker Compose命令

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📖 详细说明

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0
- 至少2GB可用内存
- 至少5GB可用磁盘空间

### 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 8666 | Web界面 |
| 后端 | 8667 | REST API |
| MongoDB | 27017 | 数据库（仅内部访问） |

### 访问地址

启动后，通过以下地址访问：

- **前端应用**: http://localhost:8666
- **后端API**: http://localhost:8667/api
- **健康检查**: http://localhost:8667/api/health

## 🏗️ 服务架构

### Docker Compose 服务

```yaml
services:
  mongodb:     # 数据库服务
  backend:     # Node.js API服务
  frontend:    # React + Nginx服务
```

### 数据持久化

使用Docker卷持久化数据：
- `mongodb_data` - MongoDB数据库文件
- `mongodb_config` - MongoDB配置文件
- `backend_logs` - 后端日志
- `./backend/uploads` - 用户上传的视频和图片

### 网络配置

所有服务运行在 `toktik-network` 桥接网络中，服务间通过容器名通信。

## 🔧 常用命令

### 基本操作

```bash
# 启动服务（后台运行）
docker-compose up -d

# 启动服务（前台运行，查看日志）
docker-compose up

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 重启单个服务
docker-compose restart backend
```

### 日志管理

```bash
# 查看所有服务日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# 查看最近100行日志
docker-compose logs --tail=100
```

### 服务管理

```bash
# 查看服务状态
docker-compose ps

# 查看资源使用情况
docker stats

# 进入容器
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh
```

### 镜像和构建

```bash
# 重新构建镜像
docker-compose build

# 强制重新构建（无缓存）
docker-compose build --no-cache

# 拉取最新镜像
docker-compose pull

# 删除未使用的镜像
docker image prune -a
```

### 数据管理

```bash
# 停止服务但保留数据
docker-compose down

# 停止服务并删除数据卷（危险！）
docker-compose down -v

# 备份MongoDB数据
docker-compose exec mongodb mongodump -o /data/backup

# 查看数据卷
docker volume ls

# 删除所有未使用的数据卷
docker volume prune
```

## ❓ 常见问题

### 1. 端口冲突

**问题**: 端口8666或8667已被占用

**解决方案**:
```bash
# 检查端口占用
lsof -i :8666
lsof -i :8667

# 修改docker-compose.yml中的端口映射
ports:
  - "9666:8666"  # 改用9666端口
```

### 2. 容器无法启动

**问题**: 容器启动失败或反复重启

**解决方案**:
```bash
# 查看详细日志
docker-compose logs backend

# 检查健康状态
docker-compose ps

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 3. 数据库连接失败

**问题**: 后端无法连接MongoDB

**解决方案**:
```bash
# 确认MongoDB已启动
docker-compose ps mongodb

# 查看MongoDB日志
docker-compose logs mongodb

# 重启MongoDB
docker-compose restart mongodb

# 等待健康检查通过
docker-compose up -d
```

### 4. 前端无法访问后端

**问题**: 前端显示网络错误

**解决方案**:
- 检查后端是否正常运行: `curl http://localhost:8667/api/health`
- 检查nginx配置是否正确
- 查看前端日志: `docker-compose logs frontend`

### 5. 上传文件丢失

**问题**: 重启后上传的视频消失

**解决方案**:
```bash
# 确保使用了卷挂载
# docker-compose.yml中已配置：
volumes:
  - ./backend/uploads:/app/uploads
```

## ⚙️ 高级配置

### 自定义环境变量

修改 `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - PORT=8667
      - JWT_SECRET=your_custom_secret
      - JWT_EXPIRE=30d
      - MAX_FILE_SIZE=209715200  # 200MB
```

### 生产环境部署

1. **使用环境变量文件**:
```bash
cp .env.example .env.production
# 编辑.env.production
docker-compose --env-file .env.production up -d
```

2. **启用HTTPS**:
- 配置反向代理（如Nginx、Traefik）
- 使用Let's Encrypt证书

3. **性能优化**:
```yaml
# 限制资源使用
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 开发模式

使用热重载进行开发：

```yaml
# docker-compose.dev.yml
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

  frontend:
    volumes:
      - ./frontend/src:/app/src
    command: npm run dev
```

启动开发环境：
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 扩展服务

水平扩展后端服务：

```bash
# 启动3个后端实例
docker-compose up -d --scale backend=3

# 需要配置负载均衡器（如Nginx）
```

### 监控和日志

集成监控工具：

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

## 🔐 安全建议

1. **更改默认密钥**
   - 修改 `JWT_SECRET`
   - 使用强密码

2. **限制网络访问**
   ```yaml
   services:
     mongodb:
       # 不暴露到外部
       # ports:
       #   - "27017:27017"
   ```

3. **定期备份**
   ```bash
   # 创建备份脚本
   docker-compose exec mongodb mongodump -o /data/backup
   ```

4. **更新镜像**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## 📞 获取帮助

遇到问题？

1. 查看日志: `docker-compose logs`
2. 检查状态: `docker-compose ps`
3. 查看健康检查: `docker inspect <container_name>`
4. 提交Issue到GitHub

## 📚 参考资料

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [MongoDB Docker镜像](https://hub.docker.com/_/mongo)
- [Nginx Docker镜像](https://hub.docker.com/_/nginx)
