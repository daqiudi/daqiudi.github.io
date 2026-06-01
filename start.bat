@echo off
chcp 65001 >nul
echo ========================================
echo   3D婚纱照片浏览应用 - 启动脚本
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [√] 检测到Python，正在启动服务器...
    echo.
    echo 服务器地址: http://localhost:8080
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8080
    goto :end
)

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [√] 检测到Node.js，正在启动服务器...
    echo.
    echo 正在安装http-server...
    npm install -g http-server >nul 2>&1
    echo.
    echo 服务器地址: http://localhost:8080
    echo 按 Ctrl+C 停止服务器
    echo.
    npx http-server -p 8080
    goto :end
)

echo [×] 未检测到Python或Node.js
echo.
echo 请选择以下方式之一启动应用：
echo.
echo 方法1: 直接在浏览器中打开 index.html 文件
echo.
echo 方法2: 安装Python后运行此脚本
echo   下载地址: https://www.python.org/downloads/
echo.
echo 方法3: 安装Node.js后运行此脚本
echo   下载地址: https://nodejs.org/
echo.
echo 方法4: 使用其他HTTP服务器
echo   例如: PHP: php -S localhost:8080
echo         Ruby: ruby -run -e httpd . -p 8080
echo.

:end
pause
