# Laravel E-Commerce Setup Script for Windows
# Following official Laravel instructions: https://laravel.com/for/agents

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Laravel E-Commerce Setup for Windows" -ForegroundColor Cyan
Write-Host "  Following Laravel Official Guidelines" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites per Laravel agent guidelines
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$phpExists = Test-CommandExists "php"
$composerExists = Test-CommandExists "composer"
$laravelExists = Test-CommandExists "laravel"
$npmExists = Test-CommandExists "npm"
$bunExists = Test-CommandExists "bun"

Write-Host "PHP: $(if($phpExists){'✓ Installed'}else{'✗ Missing'})" -ForegroundColor $(if($phpExists){'Green'}else{'Red'})
Write-Host "Composer: $(if($composerExists){'✓ Installed'}else{'✗ Missing'})" -ForegroundColor $(if($composerExists){'Green'}else{'Red'})
Write-Host "Laravel CLI: $(if($laravelExists){'✓ Installed'}else{'✗ Missing'})" -ForegroundColor $(if($laravelExists){'Green'}else{'Red'})
Write-Host "npm: $(if($npmExists){'✓ Installed'}else{'✗ Missing'})" -ForegroundColor $(if($npmExists){'Green'}else{'Yellow'})
Write-Host "bun: $(if($bunExists){'✓ Installed'}else{'✗ Missing'})" -ForegroundColor $(if($bunExists){'Green'}else{'Yellow'})
Write-Host ""

# Install missing core tools using php.new (per Laravel guidelines)
if (-not $phpExists -or -not $composerExists -or -not $laravelExists) {
    Write-Host "Installing PHP, Composer, and Laravel CLI using php.new..." -ForegroundColor Cyan
    Write-Host "This will install PHP 8.5, Composer, and Laravel CLI" -ForegroundColor Gray
    Write-Host ""
    
    # Official Laravel php.new installation for Windows
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.5'))
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "  IMPORTANT: Restart Required!" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "PHP, Composer, and Laravel CLI have been installed." -ForegroundColor Cyan
    Write-Host "Please CLOSE and REOPEN PowerShell, then run this script again." -ForegroundColor White
    Write-Host ""
    Write-Host "After restarting PowerShell, navigate to this folder and run:" -ForegroundColor Gray
    Write-Host "  .\setup.ps1" -ForegroundColor Yellow
    Write-Host ""
    
    $restart = Read-Host "Press Enter to exit, or type 'continue' if you've already restarted (not recommended)"
    if ($restart -ne 'continue') {
        exit 0
    }
    
    # Refresh environment variables attempt
    Write-Host "Attempting to refresh environment variables..." -ForegroundColor Gray
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "User") + ";" + [Environment]::GetEnvironmentVariable("Path", "Machine")
}

# Check for JavaScript package manager (npm or bun per Laravel guidelines)
$packageManager = $null
if (Test-CommandExists "npm") {
    $packageManager = "npm"
    Write-Host "Using npm as package manager" -ForegroundColor Green
} elseif (Test-CommandExists "bun") {
    $packageManager = "bun"
    Write-Host "Using bun as package manager" -ForegroundColor Green
} else {
    Write-Host "Neither npm nor bun is installed." -ForegroundColor Yellow
    Write-Host "Installing Node.js (includes npm)..." -ForegroundColor Cyan
    
    $nodeUrl = "https://nodejs.org/dist/v20.12.2/node-v20.12.2-x64.msi"
    $nodeInstaller = "$env:TEMP\node-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller -UseBasicParsing
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $nodeInstaller, "/quiet", "/norestart", "/qn", "ALLUSERS=1" -Wait
        $packageManager = "npm"
        Write-Host "Node.js installed successfully!" -ForegroundColor Green
    } catch {
        Write-Error "Failed to install Node.js. Please install from https://nodejs.org/"
        exit 1
    }
}

# Refresh environment variables
Write-Host "`nRefreshing environment variables..." -ForegroundColor Gray
$env:Path = [Environment]::GetEnvironmentVariable("Path", "User") + ";" + [Environment]::GetEnvironmentVariable("Path", "Machine")

# Verify tools are now available
if (-not (Test-CommandExists "php") -or -not (Test-CommandExists "composer")) {
    Write-Error "PHP or Composer still not found after installation. Please restart PowerShell and try again."
    exit 1
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Setting up Laravel Application" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "Project directory: $projectDir" -ForegroundColor Gray

# Check if composer.json exists
if (-not (Test-Path "composer.json")) {
    Write-Error "composer.json not found. Are you in the correct directory?"
    exit 1
}

# Install PHP dependencies
Write-Host "`nInstalling PHP dependencies with Composer..." -ForegroundColor Cyan
composer install --no-interaction --prefer-dist --optimize-autoloader

if ($LASTEXITCODE -ne 0) {
    Write-Error "Composer install failed!"
    exit 1
}

# Copy environment file
Write-Host "`nSetting up environment file..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env" -Force
        Write-Host "Created .env file from .env.example" -ForegroundColor Green
    } else {
        Write-Host "Creating default .env file..." -ForegroundColor Yellow
        @"
APP_NAME="Laravel E-Commerce"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

VITE_APP_NAME="${APP_NAME}"
"@ | Set-Content ".env"
        Write-Host "Created new .env file" -ForegroundColor Green
    }
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

# Generate application key
Write-Host "`nGenerating application key..." -ForegroundColor Cyan
php artisan key:generate --ansi

# Create SQLite database
Write-Host "`nSetting up SQLite database..." -ForegroundColor Cyan
$dbPath = Join-Path $projectDir "database\database.sqlite"
if (-not (Test-Path $dbPath)) {
    New-Item -ItemType File -Path $dbPath -Force | Out-Null
    Write-Host "Created database.sqlite" -ForegroundColor Green
} else {
    Write-Host "Database already exists" -ForegroundColor Green
}

# Run migrations
Write-Host "`nRunning database migrations..." -ForegroundColor Cyan
php artisan migrate --force --ansi

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Migration failed! You may need to run migrations manually later."
}

# Seed database
Write-Host "`nSeeding database..." -ForegroundColor Cyan
php artisan db:seed --force --ansi

# Install JavaScript dependencies
Write-Host "`nInstalling JavaScript dependencies with $packageManager..." -ForegroundColor Cyan
if ($packageManager -eq "bun") {
    bun install
} else {
    npm install
}

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Package installation failed! You may need to run it manually."
}

# Build assets
Write-Host "`nBuilding frontend assets..." -ForegroundColor Cyan
if ($packageManager -eq "bun") {
    bun run build
} else {
    npm run build
}

# Create storage link
Write-Host "`nCreating storage link..." -ForegroundColor Cyan
php artisan storage:link --ansi

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your Laravel application is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor White
Write-Host "  .\start.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or use Laravel's standard command:" -ForegroundColor White
Write-Host "  composer run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start now
$startNow = Read-Host "Start the application now? (Y/n)"
if ($startNow -ne "n" -and $startNow -ne "N") {
    & "$projectDir\start.ps1"
}
