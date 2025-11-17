@echo off
echo.
echo ========================================
echo  UI WEB SERVER - LOCAL DEV
echo ========================================
echo  Port: 8000
echo  URL: http://localhost:8000/index.local.html
echo ========================================
echo.
echo Starting server... (Keep this window open)
echo.

cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
npx http-server -p 8000 -c-1 --cors

echo.
echo Server stopped!
pause
