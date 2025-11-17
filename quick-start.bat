@echo off
REM TokTik 快速启动脚本 (Windows)

echo ================================
echo   🚀 TokTik 快速启动
echo ================================
echo.

REM 检查Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker未安装，请先安装Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker环境检查通过
echo.

REM 启动服务
echo 📦 正在启动服务...
docker-compose up -d

echo.
echo ⏳ 等待服务启动...
timeout /t 5 /nobreak >nul

REM 检查服务状态
echo.
echo 📊 服务状态：
docker-compose ps

REM 等待后端就绪
echo.
echo ⏳ 等待后端服务就绪（可能需要30-60秒）...
for /l %%i in (1,1,30) do (
    curl -s http://localhost:8667/api/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ 后端服务已就绪
        goto :ready
    )
    echo|set /p="."
    timeout /t 2 /nobreak >nul
)

:ready
echo.
echo.
echo ================================
echo   ✅ 启动完成！
echo ================================
echo.
echo 📝 访问地址：
echo    前端: http://localhost:8666
echo    后端: http://localhost:8667
echo.
echo 🎬 测试账号：
echo    邮箱: demo@toktik.com
echo    密码: 123456
echo.
echo 💡 提示：
echo    - 首次启动会自动初始化8个测试视频
echo    - 如果首页没有视频，请等待30秒后刷新
echo    - 查看日志: docker-compose logs -f
echo.
echo 🎉 现在可以打开浏览器访问 http://localhost:8666
echo.
pause
