@echo off
REM Cleanup script untuk registrasi HIMASI yang tidak selesai
REM Script ini harus dijalankan secara berkala menggunakan Task Scheduler

REM Set environment variables
if "%SITE_URL%"=="" set SITE_URL=http://localhost:3000
if "%CLEANUP_API_KEY%"=="" set CLEANUP_API_KEY=himasi-cleanup-2024

echo [%date% %time%] Starting HIMASI registration cleanup...

REM Check incomplete registrations first
echo Checking incomplete registrations...
curl -s "%SITE_URL%/api/registrations/cleanup" > temp_check.json

if %ERRORLEVEL% EQU 0 (
    echo ✅ Incomplete registrations check successful
    
    REM Parse JSON to check if there are expired registrations
    REM Note: This is a simplified check - in production you might want to use jq or PowerShell
    findstr /C:"\"count\":" temp_check.json > temp_count.txt
    
    REM Run cleanup (always run for simplicity in batch)
    echo Running cleanup...
    curl -s -X POST -H "Authorization: Bearer %CLEANUP_API_KEY%" -H "Content-Type: application/json" "%SITE_URL%/api/registrations/cleanup" > temp_cleanup.json
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Cleanup request completed
        type temp_cleanup.json
    ) else (
        echo ❌ Cleanup failed
    )
) else (
    echo ❌ Check failed
)

REM Cleanup temporary files
if exist temp_check.json del temp_check.json
if exist temp_cleanup.json del temp_cleanup.json
if exist temp_count.txt del temp_count.txt

echo [%date% %time%] HIMASI registration cleanup completed
echo ----------------------------------------