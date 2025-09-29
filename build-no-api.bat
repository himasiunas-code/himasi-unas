@echo off
echo 🚀 Static Export dengan Workaround

echo 📋 Step 1: Backup files yang bermasalah
if exist app\api mkdir app\api.backup
xcopy app\api\* app\api.backup\ /E /I /Y /Q

echo 📋 Step 2: Temporary hapus API routes
rmdir /s /q app\api

echo 📋 Step 3: Clean build
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist next.config.js del next.config.js

echo 📋 Step 4: Create static config
echo module.exports = { output: 'export', images: { unoptimized: true }, trailingSlash: true } > next.config.js

echo 📋 Step 5: Build without API routes
npm run build

echo 📋 Step 6: Restore API routes
if exist app\api.backup (
    mkdir app\api
    xcopy app\api.backup\* app\api\ /E /I /Y /Q
    rmdir /s /q app\api.backup
)

echo 📋 Step 7: Check results
if exist out (
    echo ✅ SUCCESS! Static export created
    echo 📁 Main files in 'out':
    dir out index.html 2>nul && echo - index.html found
    dir out\_next 2>nul && echo - _next folder found
    dir out\admin 2>nul && echo - admin folder found
    dir out\galeri 2>nul && echo - galeri folder found
    dir out\kegiatan 2>nul && echo - kegiatan folder found
    dir out\pendaftaran 2>nul && echo - pendaftaran folder found
    
    echo.
    echo 🎯 Ready for Hostinger upload!
) else (
    echo ❌ FAILED! No 'out' folder found
)

echo 📋 Step 8: Cleanup
del next.config.js

pause