@echo off
echo 🚀 Building Static Export for Hostinger...

REM Backup and clean existing configs
echo 📋 Backing up original config...
if exist next.config.ts copy next.config.ts next.config.backup.ts
if exist next.config.js del next.config.js
if exist next.config.mjs del next.config.mjs

REM Create clean static config
echo 🔧 Creating static export configuration...
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

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

REM Install dependencies (skip scripts to avoid Prisma issues)
echo 📦 Installing dependencies...
npm install --ignore-scripts

REM Build static export
echo 🔨 Building static export...
npm run build

REM Check if out folder was created
if exist out (
    echo ✅ Static export successful! 'out' folder created.
    
    REM Create hostinger-ready folder
    echo 📁 Preparing Hostinger upload folder...
    if exist hostinger-ready rmdir /s /q hostinger-ready
    mkdir hostinger-ready
    
    REM Copy static files
    xcopy out\* hostinger-ready\ /E /I /Y
    
    REM Create uploads directory
    mkdir hostinger-ready\uploads
    
    REM Copy PHP backend if exists
    if exist php-backend (
        mkdir hostinger-ready\api
        copy php-backend\*.php hostinger-ready\api\
        echo ✅ PHP backend copied to api folder
    )
    
    REM Create .htaccess
    (
    echo # Hostinger .htaccess for HIMASI UNAS
    echo RewriteEngine On
    echo.
    echo # Handle admin routing
    echo RewriteCond %%{REQUEST_FILENAME} !-f
    echo RewriteCond %%{REQUEST_FILENAME} !-d
    echo RewriteRule ^admin/ /admin/index.html [L]
    echo.
    echo # Handle other SPA routes
    echo RewriteCond %%{REQUEST_FILENAME} !-f
    echo RewriteCond %%{REQUEST_FILENAME} !-d
    echo RewriteRule ^galeri/ /galeri/index.html [L]
    echo RewriteRule ^kegiatan/ /kegiatan/index.html [L]
    echo RewriteRule ^pendaftaran/ /pendaftaran/index.html [L]
    echo RewriteRule ^struktur/ /struktur/index.html [L]
    echo RewriteRule ^kerja-sama/ /kerja-sama/index.html [L]
    echo.
    echo # Security
    echo Header always set X-Content-Type-Options nosniff
    echo Header always set X-Frame-Options DENY
    echo.
    echo # Compression
    echo ^<IfModule mod_deflate.c^>
    echo     AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json
    echo ^</IfModule^>
    ) > hostinger-ready\.htaccess
    
    echo.
    echo ✅ Build completed successfully!
    echo 📂 Files ready for Hostinger upload in 'hostinger-ready' folder
    echo.
    echo 📋 Upload instructions:
    echo 1. Login to Hostinger hPanel
    echo 2. Go to File Manager ^> public_html
    echo 3. Delete default files in public_html
    echo 4. Upload ALL files from 'hostinger-ready' folder
    echo 5. Set permissions if needed
    echo 6. Test your website!
    echo.
    
) else (
    echo ❌ Error: 'out' folder not created. Build may have failed.
    echo 🔍 Check the build output above for errors.
)

REM Restore original config
echo 🔄 Restoring original configuration...
del next.config.js
if exist next.config.backup.ts (
    copy next.config.backup.ts next.config.ts
    del next.config.backup.ts
)

echo.
pause