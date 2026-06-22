#!/usr/bin/env bash
#
# setup-dev-env.sh
# Sets up a Windows machine (via Git Bash) to run/develop this Laravel + Inertia + Bun project.
# Run this from Git Bash: ./setup-dev-env.sh
#
# What it does:
#   1. Checks/installs PHP, Composer, and Bun via winget (Windows Package Manager)
#   2. Installs PHP composer dependencies
#   3. Installs JS dependencies with bun
#   4. Copies .env, generates app key
#   5. Runs migrations (sqlite, so just creates the file + tables)
#   6. Builds initial frontend assets
#
# Notes:
#   - winget ships with Windows 10 (2004+) and Windows 11 by default.
#   - After installing PHP/Composer/Bun for the first time, Git Bash's PATH
#     might be stale. The script tries to refresh it, but if commands aren't
#     found at the end, just close and reopen Git Bash and re-run the script.

set -euo pipefail

echo "=================================================="
echo " Laravel + Inertia + Bun — Windows dev setup"
echo "=================================================="

# ---------------------------------------------------------
# 0. Sanity check: are we actually in Git Bash on Windows?
# ---------------------------------------------------------
if [[ "$(uname -s)" != MINGW* && "$(uname -s)" != MSYS* ]]; then
  echo "This script is meant to run inside Git Bash on Windows."
  echo "Detected: $(uname -s). Continuing anyway, but commands may differ."
fi

if ! command -v winget >/dev/null 2>&1; then
  echo ""
  echo "ERROR: 'winget' was not found."
  echo "winget comes pre-installed on Windows 10 (2004+) and Windows 11."
  echo "If missing, install 'App Installer' from the Microsoft Store, then re-run this script."
  exit 1
fi

refresh_path() {
  # Re-read PATH from the Windows registry so newly-installed tools are visible
  # in this same Git Bash session, without needing to reopen the terminal.
  export PATH="$PATH:/c/php:/c/ProgramData/ComposerSetup/bin:/c/Program Files/Bun/bin:$HOME/.bun/bin"
}

# ---------------------------------------------------------
# 1. PHP
# ---------------------------------------------------------
if command -v php >/dev/null 2>&1; then
  echo "✔ PHP already installed: $(php -v | head -n 1)"
else
  echo "→ Installing PHP via winget..."
  winget install --id PHP.PHP.8.3 -e --accept-source-agreements --accept-package-agreements
  refresh_path
fi

# ---------------------------------------------------------
# 2. Composer
# ---------------------------------------------------------
if command -v composer >/dev/null 2>&1; then
  echo "✔ Composer already installed: $(composer --version)"
else
  echo "→ Installing Composer via winget..."
  winget install --id Composer.Composer -e --accept-source-agreements --accept-package-agreements
  refresh_path
fi

# ---------------------------------------------------------
# 3. Bun
# ---------------------------------------------------------
if command -v bun >/dev/null 2>&1; then
  echo "✔ Bun already installed: $(bun --version)"
else
  echo "→ Installing Bun via winget..."
  winget install --id Oven-sh.Bun -e --accept-source-agreements --accept-package-agreements
  refresh_path
fi

refresh_path

# ---------------------------------------------------------
# Final tool check before continuing
# ---------------------------------------------------------
missing=0
for tool in php composer bun; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "✘ '$tool' still not found in PATH."
    missing=1
  fi
done

if [[ "$missing" -eq 1 ]]; then
  echo ""
  echo "Some tools were installed but aren't visible in this Git Bash session yet."
  echo "Close this terminal, open a NEW Git Bash window, cd back into the project,"
  echo "and run this script again — it will skip what's already installed and"
  echo "continue with the project setup below."
  exit 1
fi

# ---------------------------------------------------------
# 4. Required PHP extensions check (common gaps on Windows)
# ---------------------------------------------------------
echo ""
echo "→ Checking required PHP extensions..."
required_ext=(openssl pdo mbstring tokenizer xml ctype json bcmath fileinfo pdo_sqlite)
missing_ext=()
for ext in "${required_ext[@]}"; do
  if ! php -m | grep -qi "^${ext}$"; then
    missing_ext+=("$ext")
  fi
done

if [[ ${#missing_ext[@]} -gt 0 ]]; then
  echo "✘ Missing PHP extensions: ${missing_ext[*]}"
  echo "  Open your php.ini (run 'php --ini' to find its path) and uncomment/add:"
  for ext in "${missing_ext[@]}"; do
    echo "    extension=${ext}"
  done
  echo "  Then re-run this script."
  exit 1
else
  echo "✔ All required PHP extensions are enabled."
fi

# ---------------------------------------------------------
# 5. Project dependencies
# ---------------------------------------------------------
echo ""
echo "→ Installing PHP dependencies (composer install)..."
composer install --no-interaction

echo ""
echo "→ Installing JS dependencies (bun install)..."
bun install

# ---------------------------------------------------------
# 6. .env setup
# ---------------------------------------------------------
if [[ ! -f ".env" ]]; then
  if [[ -f ".env.example" ]]; then
    echo ""
    echo "→ Creating .env from .env.example..."
    cp .env.example .env
  else
    echo "✘ No .env.example found — skipping .env creation, create it manually."
  fi
else
  echo "✔ .env already exists, leaving it as is."
fi

if [[ -f ".env" ]] && ! grep -q "^APP_KEY=.\+" .env; then
  echo "→ Generating application key..."
  php artisan key:generate
else
  echo "✔ APP_KEY already set."
fi

# ---------------------------------------------------------
# 7. SQLite database file
# ---------------------------------------------------------
mkdir -p database
if [[ ! -f "database/database.sqlite" ]]; then
  echo "→ Creating database/database.sqlite..."
  touch database/database.sqlite
else
  echo "✔ database/database.sqlite already exists."
fi

echo ""
echo "→ Running migrations..."
php artisan migrate --force

# ---------------------------------------------------------
# 8. Build frontend assets once
# ---------------------------------------------------------
echo ""
echo "→ Building frontend assets (bun run build)..."
bun run build

# ---------------------------------------------------------
# Done
# ---------------------------------------------------------
echo ""
echo "=================================================="
echo " ✔ Setup complete!"
echo "=================================================="
echo ""
echo "To start developing, run:"
echo "  composer run dev"
echo ""
echo "(this starts the PHP server, queue listener, and Vite dev server together)"
echo "App will be available at http://localhost:8000"
