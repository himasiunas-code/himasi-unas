@echo off
echo Testing WhatsApp Integration...
echo.

echo Starting development server in background...
start /B npm run dev

echo.
echo Waiting for server to start (10 seconds)...
timeout /t 10 /nobreak > nul

echo.
echo Running WhatsApp service test...
node test-whatsapp-service.js

echo.
echo Running admin flow test...
node test-admin-whatsapp-flow.js

echo.
echo Test completed! Check your WhatsApp for messages.
pause