@echo off
echo ================================
echo E-Commerce Platform Setup
echo ================================
echo.

echo [1/4] Installing Backend Dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)
echo.

echo [2/4] Seeding Admin User...
call npm run seed:admin
echo.

echo [3/4] Installing Frontend Dependencies...
cd ../client
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    pause
    exit /b 1
)
cd ..
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Configure server/.env with your credentials
echo 2. Start MongoDB
echo 3. Run backend: cd server ^&^& npm run dev
echo 4. Run frontend: cd client ^&^& npm run dev
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
pause
