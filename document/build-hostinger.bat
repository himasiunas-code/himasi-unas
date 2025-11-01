@echo off
REM Build script untuk deploy ke Hostinger (Windows)

echo 🚀 Building HIMASI UNAS for Hostinger...

REM Step 1: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist hostinger-upload rmdir /s /q hostinger-upload

REM Step 2: Install dependencies
echo 📦 Installing dependencies...
npm install

REM Step 3: Generate Prisma client (with retry)
echo 🗄️ Generating Prisma client...
echo Trying to generate Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ⚠️  First attempt failed, cleaning and retrying...
    rmdir /s /q node_modules\.prisma 2>nul
    npx prisma generate
)

REM Step 4: Build Next.js app
echo 🔨 Building Next.js application...
npm run build

REM Step 5: Export static files
echo 📤 Exporting static files...
npm run export

REM Step 6: Create upload-ready structure
echo 📁 Preparing files for upload...
mkdir hostinger-upload

REM Copy static files
xcopy out\* hostinger-upload\ /E /I /Y

REM Copy PHP backend
mkdir hostinger-upload\api
copy php-backend\*.php hostinger-upload\api\

REM Copy uploads directory
mkdir hostinger-upload\uploads
copy public\uploads\.gitkeep hostinger-upload\uploads\

REM Create .htaccess
(
echo # Enable mod_rewrite
echo RewriteEngine On
echo.
echo # Handle client-side routing
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteCond %%{REQUEST_FILENAME} !-d
echo RewriteRule ^admin/ /admin/index.html [L]
echo.
echo # Security headers
echo Header always set X-Frame-Options DENY
echo Header always set X-Content-Type-Options nosniff
echo.
echo # Enable compression
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/plain
echo     AddOutputFilterByType DEFLATE text/html
echo     AddOutputFilterByType DEFLATE text/css
echo     AddOutputFilterByType DEFLATE application/javascript
echo ^</IfModule^>
) > hostinger-upload\.htaccess

echo ✅ Build completed!
echo 📂 Files ready for upload in 'hostinger-upload' folder
echo.
echo 📋 Next steps:
echo 1. Login to Hostinger hPanel
echo 2. Go to File Manager → public_html
echo 3. Upload all files from 'hostinger-upload' folder
echo 4. Setup database connection
echo 5. Test website functionality

pause