FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads/videos uploads/avatars

# 暴露端口
EXPOSE 8667

# 启动应用
CMD ["npm", "start"]
