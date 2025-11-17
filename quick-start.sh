#!/bin/bash

# TokTik 快速启动脚本

echo "================================"
echo "  🚀 TokTik 快速启动"
echo "================================"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose未安装"
    exit 1
fi

echo "✅ Docker环境检查通过"
echo ""

# 启动服务
echo "📦 正在启动服务..."
docker-compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "📊 服务状态："
docker-compose ps

# 等待后端就绪
echo ""
echo "⏳ 等待后端服务就绪（可能需要30-60秒）..."
for i in {1..30}; do
    if curl -s http://localhost:8667/api/health > /dev/null 2>&1; then
        echo "✅ 后端服务已就绪"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo ""
echo "================================"
echo "  ✅ 启动完成！"
echo "================================"
echo ""
echo "📝 访问地址："
echo "   前端: http://localhost:8666"
echo "   后端: http://localhost:8667"
echo ""
echo "🎬 测试账号："
echo "   邮箱: demo@toktik.com"
echo "   密码: 123456"
echo ""
echo "💡 提示："
echo "   - 首次启动会自动初始化8个测试视频"
echo "   - 如果首页没有视频，请等待30秒后刷新"
echo "   - 查看日志: docker-compose logs -f"
echo ""
echo "🎉 现在可以打开浏览器访问 http://localhost:8666"
echo ""
