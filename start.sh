#!/bin/bash

# TokTik Docker 启动脚本

echo "================================"
echo "    TokTik 启动脚本"
echo "================================"
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker未安装"
    echo "请先安装Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误: Docker Compose未安装"
    echo "请先安装Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker环境检查通过"
echo ""

# 选择操作
echo "请选择操作："
echo "1) 启动所有服务"
echo "2) 停止所有服务"
echo "3) 重启所有服务"
echo "4) 查看服务状态"
echo "5) 查看日志"
echo "6) 清理并重新构建"
echo "7) 完全清理（包括数据卷）"
echo ""
read -p "请输入选项 (1-7): " choice

case $choice in
    1)
        echo ""
        echo "🚀 启动TokTik服务..."
        docker-compose up -d
        echo ""
        echo "✅ 服务启动成功！"
        echo ""
        echo "访问地址："
        echo "  前端: http://localhost:8666"
        echo "  后端: http://localhost:8667"
        echo ""
        echo "查看日志: docker-compose logs -f"
        ;;
    2)
        echo ""
        echo "🛑 停止所有服务..."
        docker-compose down
        echo "✅ 服务已停止"
        ;;
    3)
        echo ""
        echo "🔄 重启所有服务..."
        docker-compose restart
        echo "✅ 服务已重启"
        ;;
    4)
        echo ""
        echo "📊 服务状态："
        docker-compose ps
        ;;
    5)
        echo ""
        echo "📜 查看日志（Ctrl+C退出）："
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "🔨 清理并重新构建..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ 重新构建完成"
        ;;
    7)
        echo ""
        read -p "⚠️  警告：此操作将删除所有数据！确认？(yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  完全清理中..."
            docker-compose down -v
            echo "✅ 清理完成"
        else
            echo "❌ 操作已取消"
        fi
        ;;
    *)
        echo ""
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
