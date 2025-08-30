# clean-next.ps1 - PowerShell script to clean Next.js cache and start development server

Write-Host "🧹 Cleaning Next.js cache before starting development server..." -ForegroundColor Cyan

# Kill any running node processes
try {
    Write-Host "⏹️ Stopping running Node.js processes..." -ForegroundColor Yellow
    taskkill /f /im node.exe 2>$null
    Write-Host "✅ Node.js processes stopped" -ForegroundColor Green
}
catch {
    Write-Host "ℹ️ No running Node.js processes found" -ForegroundColor Gray
}

# Path to .next directory
$nextDir = Join-Path $PSScriptRoot ".next"

# Clean with error handling
if (Test-Path $nextDir) {
    try {
        Write-Host "🗑️ Removing .next directory..." -ForegroundColor Yellow
        Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
        Write-Host "✅ Clean completed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Warning: Could not completely clean .next directory: $_" -ForegroundColor Red
        
        # Try using rimraf as an alternative
        try {
            Write-Host "🔄 Trying alternative cleaning method..." -ForegroundColor Yellow
            npm exec rimraf .next
            Write-Host "✅ Clean completed with alternative method" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Alternative cleaning failed: $_" -ForegroundColor Red
            Write-Host "🔄 Continuing anyway, will try to start development server..." -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "ℹ️ No .next directory found, starting with clean slate" -ForegroundColor Green
}

# Start the development server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Cyan
npm run dev 