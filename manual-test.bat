@echo off
echo 🧪 Manual Static Export Test

echo 📋 Step 1: Clean environment
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist next.config.js del next.config.js

echo 📋 Step 2: Create minimal config
echo module.exports = { output: 'export', images: { unoptimized: true } } > next.config.js

echo 📋 Step 3: Build (without turbopack)
npx next build

echo 📋 Step 4: Check results
if exist out (
    echo ✅ SUCCESS! Static export created
    echo 📁 Files in 'out' folder:
    dir out /b
) else (
    echo ❌ FAILED! No 'out' folder found
)

echo 📋 Step 5: Cleanup
del next.config.js

pause