# Laravel E-Commerce - Windows Setup Guide

This guide helps you set up and run the Laravel E-Commerce application on Windows.

## Prerequisites

- Windows 10 or Windows 11
- PowerShell (comes with Windows)
- Internet connection

## Quick Start

### First Time Setup (Run Once)

1. **Open PowerShell as Administrator** (right-click PowerShell → Run as Administrator)

2. **Navigate to the project folder:**
   ```powershell
   cd C:\path\to\ecommerce\ecom
   ```

3. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```

   This will automatically:
   - Install Git (if not present)
   - Install PHP 8.3 with required extensions
   - Install Composer
   - Install Node.js
   - Install all PHP dependencies (`composer install`)
   - Install all JavaScript dependencies (`npm install`)
   - Create the SQLite database
   - Run migrations and seeders
   - Build frontend assets
   - Generate application key

   The setup takes 5-15 minutes depending on your internet speed.

### Starting the Application

After setup is complete, start the application anytime with:

```powershell
.\start.ps1
```

This starts:
- **Laravel development server** at http://localhost:8000
- **Vite dev server** at http://localhost:5173 (for hot reloading)

Press `Ctrl+C` to stop both servers.

### Command Line Options

The start script supports several options:

```powershell
# Start on a different port
.\start.ps1 -Port 3000

# Build production assets before starting
.\start.ps1 -Build

# Start without Vite (useful for production testing)
.\start.ps1 -NoVite
```

## Manual Setup (Alternative)

If you prefer to install components manually or the automated setup fails:

### 1. Install Prerequisites

1. **PHP 8.2+**: Download from https://windows.php.net/download/
   - Choose VS16 x64 Non Thread Safe
   - Extract to `C:\php`
   - Copy `php.ini-development` to `php.ini`
   - Enable extensions: curl, fileinfo, gd, intl, mbstring, openssl, pdo_sqlite, sqlite3, zip

2. **Composer**: Download from https://getcomposer.org/download/
   - Run the Windows installer

3. **Node.js**: Download from https://nodejs.org/
   - Choose the LTS version

4. **Git**: Download from https://git-scm.com/download/win

Add all to your system PATH if not done automatically.

### 2. Install Dependencies

```powershell
# PHP dependencies
composer install

# JavaScript dependencies
npm install
```

### 3. Configure Environment

```powershell
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Setup Database

```powershell
# Create SQLite database file
New-Item database\database.sqlite -ItemType File

# Run migrations
php artisan migrate

# Seed with sample data
php artisan db:seed
```

### 5. Build Assets

```powershell
npm run build
```

### 6. Start the Application

```powershell
# Terminal 1: Start Laravel
php artisan serve

# Terminal 2: Start Vite (for development)
npm run dev
```

## Troubleshooting

### "php is not recognized as a command"
- PHP is not in your PATH
- Restart PowerShell after setup, or add `C:\php` to PATH manually

### "composer is not recognized as a command"
- Restart PowerShell after setup
- Or run `C:\php\composer` directly

### Port 8000 is already in use
```powershell
# Use a different port
.\start.ps1 -Port 3000
```

### Database errors
```powershell
# Reset the database
php artisan migrate:fresh --seed
```

### Permission errors
- Make sure you're running PowerShell as Administrator for the setup script
- The start script can run as regular user

### Vite/HMR not working
```powershell
# Clear npm cache and reinstall
npm cache clean --force
Remove-Item node_modules -Recurse -Force
npm install
npm run dev
```

## Useful Commands

```powershell
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Reset database (fresh start)
php artisan migrate:fresh --seed

# Build for production
npm run build

# Run tests
php artisan test
```

## Project Structure

```
ecom/
├── app/              # Application logic
├── bootstrap/        # Bootstrap files
├── config/           # Configuration files
├── database/         # Migrations and seeds
├── public/           # Public assets
├── resources/        # Views, CSS, JS
├── routes/           # Route definitions
├── storage/          # Logs, cache, uploads
├── tests/            # Test files
├── vendor/           # PHP dependencies (auto-generated)
├── node_modules/     # JS dependencies (auto-generated)
├── .env              # Environment configuration
├── setup.ps1         # Windows setup script
└── start.ps1         # Windows start script
```

## Support

For issues specific to this e-commerce application, check the main README.md file.

For Laravel documentation, visit: https://laravel.com/docs/13.x
