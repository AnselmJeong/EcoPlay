#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting EcoPlay services..."

# Start backend (FastAPI)
echo "→ Starting backend (FastAPI) on http://localhost:8000"
cd "$ROOT_DIR/backend"
uvicorn main:app --reload &
BACKEND_PID=$!

# Start frontend (Next.js)
echo "→ Starting frontend (Next.js) on http://localhost:9002"
cd "$ROOT_DIR/frontend"
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "EcoPlay is running:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:9002"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for either process to exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
