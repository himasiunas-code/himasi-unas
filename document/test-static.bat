@echo off
echo 🧪 Quick Test - Static Export

REM Backup and remove existing configs
if exist next.config.ts copy next.config.ts next.config.backup.ts
if exist next.config.js del next.config.js
if exist next.config.mjs del next.config.mjs

REM Create clean static config
echo 🔧 Creating static export config...
(
echo module.exports = {
echo   output: 'export',
echo   images: {
echo     unoptimized: true,
echo   },
echo   trailingSlash: true,
echo   distDir: '.next'
echo }
) > next.config.js

REM Clean build
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

echo 🔨 Building with static export...
npm run build:static

REM Check result
if exist out (
    echo.
    echo ✅ SUCCESS! 'out' folder created with %cd%\out
    dir out
    echo.
    echo 📁 Contents of 'out' folder:
    dir out /b
) else (
    echo.
    echo ❌ FAILED! 'out' folder not created
)

REM Restore original config
del next.config.js
if exist next.config.backup.ts (
    copy next.config.backup.ts next.config.ts
    del next.config.backup.ts
)

pause