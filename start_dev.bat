@echo off
chcp 65001 > nul

echo Starting EliteShop Development Environment...

REM Navigate to the directory where the script is located
cd /d "%~dp0"

REM Force remove existing virtual environment to prevent path conflicts
if exist venv rmdir /s /q venv

echo Creating virtual environment...
python -m venv venv

REM Define paths to venv executables
set PYTHON_VENV=venv\Scripts\python.exe
set PIP_VENV=venv\Scripts\pip.exe

echo Installing backend dependencies...
%PIP_VENV% install -r requirements.txt
%PIP_VENV% install python-dotenv Flask-Session

REM Set development environment variables
set FLASK_ENV=development

REM Create .env file if it doesn't exist
if not exist .env (
    echo SECRET_KEY=your_local_secret_key_here > .env
    echo FLASK_ENV=development >> .env
    echo Created .env file with a dummy SECRET_KEY.
)

REM Start Flask backend
echo Starting Flask backend...
start /B %PYTHON_VENV% src\main.py

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Navigate to frontend and install dependencies
echo Installing frontend dependencies...
cd frontend

REM Install npm dependencies if node_modules does not exist
if not exist node_modules (
    npm install
)

REM Create .env file for frontend if it doesn't exist
if not exist .env (
    echo VITE_API_BASE_URL=/api > .env
    echo Created frontend .env file.
)

REM Start frontend
echo Starting React frontend...
start /B npm run dev

echo.
echo EliteShop is starting up!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/admin
echo.
echo Press any key to stop all services...
pause > nul

REM Cleanup
echo.
echo Stopping services...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo All services stopped


