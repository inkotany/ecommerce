#!/bin/bash

cd "$(dirname "$0")"

echo "Starting Shamie e-shopping..."

# Start Laravel dev server in background
php artisan serve --host=0.0.0.0 --port=8000 &
LARAVEL_PID=$!

# Start Vite dev server in background
bun run dev &
VITE_PID=$!

echo ""
echo "🚀 Server running at http://localhost:8000"
echo "📦 Vite dev server running"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for either process to exit
wait $LARAVEL_PID $VITE_PID