# Laravel E-Commerce Start Script for Windows
# Starts Laravel development server and Vite dev server
# Based on Laravel Documentation: https://laravel.com/docs/13.x

param(
    [switch]$Build,
    [switch]$NoVite,
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting Laravel E-Commerce App" -ForegroundColor Cyan
Write-Host "  Following Laravel 13.x Documentation" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Helper function to check if command exists
function Test-CommandExists {
    param($Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-CommandExists "php")) {
    Write-Error "PHP is not installed or not in PATH. Please run setup.ps1 first."
    exit 1
}

if (-not (Test-CommandExists "composer")) {
    Write-Error "Composer is not installed or not in PATH. Please run setup.ps1 first."
    exit 1
}

$phpVersion = php -r "echo PHP_VERSION;"
Write-Host "PHP version: $phpVersion" -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env" -Force
        php artisan key:generate --ansi
    } else {
        Write-Error ".env file not found and no .env.example to copy!"
        exit 1
    }
}

# Check if vendor directory exists
if (-not (Test-Path "vendor")) {
    Write-Host "Installing PHP dependencies..." -ForegroundColor Yellow
    composer install --no-interaction --prefer-dist --optimize-autoloader
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Composer install failed!"
        exit 1
    }
}

# Check if database exists
$dbPath = Join-Path $projectDir "database\database.sqlite"
if (-not (Test-Path $dbPath)) {
    Write-Host "Creating SQLite database..." -ForegroundColor Yellow
    New-Item -ItemType File -Path $dbPath -Force | Out-Null
    Write-Host "Running migrations..." -ForegroundColor Yellow
    php artisan migrate --force --ansi
    php artisan db:seed --force --ansi
}

# Clear caches for development
Write-Host "`nClearing caches..." -ForegroundColor Cyan
php artisan cache:clear --ansi
php artisan config:clear --ansi
php artisan view:clear --ansi
php artisan route:clear --ansi

Write-Host "Caches cleared!" -ForegroundColor Green

# Check node_modules
if (-not $NoVite) {
    if (-not (Test-Path "node_modules")) {
        Write-Host "`nInstalling JavaScript dependencies..." -ForegroundColor Yellow
        
        if (Test-CommandExists "npm") {
            npm install
            
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "npm install failed! Continuing without Vite..."
                $NoVite = $true
            }
        } else {
            Write-Warning "npm not found. Skipping Vite dev server."
            $NoVite = $true
        }
    }
}

# Build assets if requested
if ($Build) {
    Write-Host "`nBuilding production assets..." -ForegroundColor Cyan
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Build failed!"
    } else {
        Write-Host "Assets built successfully!" -ForegroundColor Green
    }
}

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  Starting Development Servers" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Laravel Application: http://localhost:$Port" -ForegroundColor Cyan

if (-not $NoVite) {
    Write-Host "Vite Dev Server: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Hot Module Replacement (HMR) enabled" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to cleanup processes on exit
function Cleanup {
    Write-Host "`n`nStopping servers..." -ForegroundColor Yellow
    
    if ($laravelProcess -and -not $laravelProcess.HasExited) {
        Stop-Process -Id $laravelProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Laravel server stopped" -ForegroundColor Gray
    }
    
    if ($viteProcess -and -not $viteProcess.HasExited) {
        Stop-Process -Id $viteProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Vite server stopped" -ForegroundColor Gray
    }
    
    Write-Host "All servers stopped. Goodbye!" -ForegroundColor Green
    exit
}

# Register cleanup on Ctrl+C
[Console]::TreatControlCAsInput = $true

# Start Laravel server
$laravelCmd = "php artisan serve --host=localhost --port=$Port"
$laravelProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", $laravelCmd -PassThru -NoNewWindow

# Start Vite dev server if not disabled
if (-not $NoVite) {
    $viteCmd = "npm run dev"
    $viteProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", $viteCmd -PassThru -NoNewWindow
}

# Wait and monitor processes
try {
    while ($true) {
        # Check if processes are still running
        if ($laravelProcess.HasExited) {
            Write-Host "`nLaravel server has stopped unexpectedly!" -ForegroundColor Red
            Cleanup
        }
        
        if ($viteProcess -and $viteProcess.HasExited) {
            Write-Host "`nVite server has stopped unexpectedly!" -ForegroundColor Red
            # Don't exit, Laravel can still work without Vite in production mode
        }
        
        # Check for Ctrl+C
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq "C" -and $key.Modifiers -eq "Control") {
                Cleanup
            }
        }
        
        Start-Sleep -Milliseconds 100
    }
} catch {
    Cleanup
}
