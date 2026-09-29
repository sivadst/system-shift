@echo off
title SYSTEM//SHIFT Launcher
echo =====================================================================
echo                     SYSTEM//SHIFT
echo        The machine has the data. Humans need the context.
echo           PS05 Hackathon: The Human-Machine Gap
echo =====================================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "SYSTEM//SHIFT Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ...
start "SYSTEM//SHIFT Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are booting!
echo Web Application: http://127.0.0.1:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo.
pause
