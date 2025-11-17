@echo off
REM TokTik Docker 启动脚本 (Windows)

echo ================================
echo     TokTik 启动脚本
echo ================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Docker未安装
    echo 请先安装Docker Desktop: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

echo ✅ Docker环境检查通过
echo.

REM 选择操作
echo 请选择操作：
echo 1) 启动所有服务
echo 2) 停止所有服务
echo 3) 重启所有服务
echo 4) 查看服务状态
echo 5) 查看日志
echo 6) 清理并重新构建
echo 7) 完全清理（包括数据卷）
echo.
set /p choice="请输入选项 (1-7): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto rebuild
if "%choice%"=="7" goto clean
goto invalid

:start
echo.
echo 🚀 启动TokTik服务...
docker-compose up -d
echo.
echo ✅ 服务启动成功！
echo.
echo 访问地址：
echo   前端: http://localhost:8666
echo   后端: http://localhost:8667
echo.
echo 查看日志: docker-compose logs -f
goto end

:stop
echo.
echo 🛑 停止所有服务...
docker-compose down
echo ✅ 服务已停止
goto end

:restart
echo.
echo 🔄 重启所有服务...
docker-compose restart
echo ✅ 服务已重启
goto end

:status
echo.
echo 📊 服务状态：
docker-compose ps
goto end

:logs
echo.
echo 📜 查看日志（Ctrl+C退出）：
docker-compose logs -f
goto end

:rebuild
echo.
echo 🔨 清理并重新构建...
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo ✅ 重新构建完成
goto end

:clean
echo.
set /p confirm="⚠️  警告：此操作将删除所有数据！确认？(yes/no): "
if "%confirm%"=="yes" (
    echo 🗑️  完全清理中...
    docker-compose down -v
    echo ✅ 清理完成
) else (
    echo ❌ 操作已取消
)
goto end

:invalid
echo.
echo ❌ 无效选项
pause
exit /b 1

:end
echo.
pause
