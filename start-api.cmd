@echo off
echo.
echo ========================================
echo  AZURE FUNCTIONS API - LOCAL DEV
echo ========================================
echo  Port: 7071
echo  Database: Cosmos DB Emulator
echo ========================================
echo.
echo Starting API... (Keep this window open)
echo.

cd /d "%~dp0api"
set PATH=C:\Program Files\nodejs;%PATH%
"C:\Program Files\Microsoft\Azure Functions Core Tools\func.exe" start --port 7071

echo.
echo API stopped!
pause
