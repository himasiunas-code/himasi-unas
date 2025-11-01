@echo off
REM Build script untuk deploy ke Hostinger (Alternative - No Prisma)

echo 🚀 Building HIMASI UNAS for Hostinger (Alternative Method)...

REM Step 1: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist hostinger-upload rmdir /s /q hostinger-upload

REM Step 2: Install dependencies (skip postinstall)
echo 📦 Installing dependencies...
npm install --ignore-scripts

REM Step 3: Skip Prisma generation (untuk static export)
echo ⚠️  Skipping Prisma client generation for static build...

REM Step 4: Update next.config for static export
echo 🔧 Updating Next.js config for static export...
(
echo /** @type {import('next'^}.NextConfig} */
echo const nextConfig = {
echo   output: 'export',
echo   images: {
echo     unoptimized: true,
echo   },
echo   trailingSlash: true,
echo   // Disable API routes for static export
echo   // serverExternalPackages: ['@prisma/client'^],
echo };
echo.
echo module.exports = nextConfig;
) > next.config.static.js

REM Backup original config and use static config
copy next.config.ts next.config.original.ts
copy next.config.static.js next.config.js

REM Step 5: Build Next.js app (static only)
echo 🔨 Building Next.js application (static export)...
npm run build

REM Step 6: Restore original config
copy next.config.original.ts next.config.ts
del next.config.js
del next.config.static.js
del next.config.original.ts

REM Step 7: Create upload-ready structure
echo 📁 Preparing files for upload...
mkdir hostinger-upload

REM Copy static files
xcopy out\* hostinger-upload\ /E /I /Y

REM Copy PHP backend (alternative to API routes)
mkdir hostinger-upload\api
copy php-backend\*.php hostinger-upload\api\

REM Copy uploads directory
mkdir hostinger-upload\uploads
copy public\uploads\.gitkeep hostinger-upload\uploads\ 2>nul

REM Create database setup SQL (for MySQL)
(
echo -- HIMASI UNAS Database Setup for MySQL/Hostinger
echo -- Run this in your Hostinger database
echo.
echo CREATE DATABASE IF NOT EXISTS himasi_unas;
echo USE himasi_unas;
echo.
echo -- Activities table
echo CREATE TABLE activities ^(
echo   id VARCHAR^(36^) PRIMARY KEY DEFAULT ^(UUID^(^)^),
echo   title VARCHAR^(255^) NOT NULL,
echo   slug VARCHAR^(255^) UNIQUE NOT NULL,
echo   description TEXT,
echo   startDate DATETIME,
echo   endDate DATETIME,
echo   location VARCHAR^(255^),
echo   maxParticipants INT,
echo   registrationOpen BOOLEAN DEFAULT TRUE,
echo   registrationDeadline DATETIME,
echo   isPublished BOOLEAN DEFAULT FALSE,
echo   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
echo   updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
echo ^);
echo.
echo -- Registrations table
echo CREATE TABLE registrations ^(
echo   id VARCHAR^(36^) PRIMARY KEY DEFAULT ^(UUID^(^)^),
echo   activityId VARCHAR^(36^),
echo   email VARCHAR^(255^) NOT NULL,
echo   fullName VARCHAR^(255^) NOT NULL,
echo   phone VARCHAR^(20^),
echo   yearClass VARCHAR^(50^),
echo   faculty VARCHAR^(255^),
echo   major VARCHAR^(255^),
echo   instagramHandle VARCHAR^(100^),
echo   instagramProof TEXT,
echo   motivation TEXT,
echo   specialRequest TEXT,
echo   status ENUM^('PENDING', 'APPROVED', 'REJECTED'^) DEFAULT 'PENDING',
echo   rejectedReason TEXT,
echo   approvedAt DATETIME,
echo   approvedBy VARCHAR^(255^),
echo   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
echo   updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
echo   FOREIGN KEY ^(activityId^) REFERENCES activities^(id^) ON DELETE CASCADE,
echo   UNIQUE KEY unique_activity_email ^(activityId, email^)
echo ^);
echo.
echo -- Insert sample activity
echo INSERT INTO activities ^(title, slug, description, startDate, location, maxParticipants, registrationOpen, isPublished^) VALUES
echo ^('Open Recruitment HIMASI 2025', 'open-recruitment-2025', 'Bergabunglah dengan HIMASI UNAS untuk mengembangkan potensi di bidang Sistem Informasi', '2025-10-01 09:00:00', 'Kampus UNAS Jakarta', 100, TRUE, TRUE^);
) > hostinger-upload\database-setup.sql

REM Create PHP config file
(
echo ^<?php
echo // Database configuration untuk Hostinger
echo $host = 'localhost'; // atau IP database Hostinger
echo $dbname = 'himasi_unas'; // nama database di Hostinger
echo $username = 'your_db_username'; // username database
echo $password = 'your_db_password'; // password database
echo.
echo try {
echo     $pdo = new PDO^("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password^);
echo     $pdo-^>setAttribute^(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION^);
echo } catch^(PDOException $e^) {
echo     die^("Connection failed: " . $e-^>getMessage^(^)^);
echo }
echo ?^>
) > hostinger-upload\api\config.php

REM Create .htaccess
(
echo # Enable mod_rewrite
echo RewriteEngine On
echo.
echo # Handle client-side routing untuk admin
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteCond %%{REQUEST_FILENAME} !-d
echo RewriteRule ^admin/.*$ /admin/index.html [L]
echo.
echo # API routing ke PHP
echo RewriteRule ^api/registrations$ /api/registrations.php [L]
echo RewriteRule ^api/upload$ /api/upload.php [L]
echo.
echo # Security headers
echo Header always set X-Frame-Options DENY
echo Header always set X-Content-Type-Options nosniff
echo.
echo # Enable compression
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/plain text/html text/css application/javascript
echo ^</IfModule^>
echo.
echo # Cache static assets
echo ^<IfModule mod_expires.c^>
echo     ExpiresActive on
echo     ExpiresByType text/css "access plus 1 year"
echo     ExpiresByType application/javascript "access plus 1 year"
echo     ExpiresByType image/* "access plus 1 year"
echo ^</IfModule^>
) > hostinger-upload\.htaccess

REM Create deployment instructions
(
echo # 🚀 Deployment Instructions for Hostinger
echo.
echo ## 📋 Checklist
echo 1. [^] Upload all files from 'hostinger-upload' to public_html/
echo 2. [^] Create MySQL database in Hostinger hPanel
echo 3. [^] Run database-setup.sql in your database
echo 4. [^] Update api/config.php with your database credentials
echo 5. [^] Set file permissions: PHP files to 644, directories to 755
echo 6. [^] Test website at your domain
echo.
echo ## 🗄️ Database Setup
echo 1. Login to Hostinger hPanel
echo 2. Go to Databases ^> MySQL Databases
echo 3. Create new database 'himasi_unas'
echo 4. Import/run the SQL from 'database-setup.sql'
echo 5. Update 'api/config.php' with database credentials
echo.
echo ## 🔧 Configuration Files to Update
echo - api/config.php: Update database credentials
echo - .htaccess: Should work as-is
echo.
echo ## 🧪 Testing
echo - Homepage: https://yourdomain.com
echo - Admin: https://yourdomain.com/admin
echo - API test: https://yourdomain.com/api/registrations.php
echo.
echo ## ⚠️ Important Notes
echo - This is STATIC EXPORT - no server-side rendering
echo - Database operations handled by PHP backend
echo - File uploads go to /uploads/ directory
echo - Admin authentication uses simple PHP sessions
) > hostinger-upload\DEPLOYMENT_INSTRUCTIONS.md

echo ✅ Static build completed successfully!
echo 📂 Files ready for upload in 'hostinger-upload' folder
echo.
echo 📋 What's included:
echo ✅ Static HTML/CSS/JS files (from Next.js export)
echo ✅ PHP backend for API functionality
echo ✅ Database setup SQL for MySQL
echo ✅ .htaccess for routing
echo ✅ Deployment instructions
echo.
echo 🚀 Next steps:
echo 1. Read DEPLOYMENT_INSTRUCTIONS.md in hostinger-upload folder
echo 2. Upload all files to Hostinger public_html/
echo 3. Setup MySQL database
echo 4. Update database credentials in api/config.php
echo 5. Test your website!
echo.
pause