@echo off
echo.
echo 🚀 Opening Skyrafi White Paper...
echo.

REM Get the current directory path
set currentPath=%~dp0

REM Open the HTML file in default browser
start "" "%currentPath%Skyrafi_Mobile_App_WhitePaper.html"

echo ✅ White paper opened in your browser!
echo.
echo 📋 To create PDF:
echo 1. Press Ctrl + P in the browser
echo 2. Choose "Save as PDF" as destination  
echo 3. Enable "Background graphics" option
echo 4. Click Save and name it: Skyrafi_Mobile_App_WhitePaper.pdf
echo.
echo 🎉 Your professional PDF will be ready!
echo.
pause