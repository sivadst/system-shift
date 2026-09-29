Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "                    SYSTEM//SHIFT" -ForegroundColor Cyan
Write-Host "       The machine has the data. Humans need the context." -ForegroundColor White
Write-Host "          PS05 Hackathon: The Human-Machine Gap" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

Write-Host "[2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Services launched successfully!" -ForegroundColor Cyan
Write-Host "Web Application: http://127.0.0.1:5173" -ForegroundColor Yellow
Write-Host "API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host ""
