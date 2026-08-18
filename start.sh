#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

check_port() {
  local port="$1"
  local service_name="$2"
  if lsof -iTCP:"$port" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
    echo "Error: port $port is already in use. Stop the existing process before starting $service_name."
    lsof -iTCP:"$port" -sTCP:LISTEN -n -P
    exit 1
  fi
}

export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "Error: NVM is required to start EcoPlay with Node.js 22."
  echo "Install NVM and Node.js $(cat "$ROOT_DIR/.nvmrc"), then run start.sh again."
  exit 1
fi

. "$NVM_DIR/nvm.sh"
NODE_VERSION="$(cat "$ROOT_DIR/.nvmrc")"
nvm use "$NODE_VERSION" >/dev/null
export PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"
hash -r

if [ "$(node --version | cut -d. -f1)" != "v22" ]; then
  echo "Error: EcoPlay requires Node.js 22, but $(node --version) is active."
  exit 1
fi

check_port 8000 "backend"
check_port 9002 "frontend"

echo "Starting EcoPlay services..."

spawn_in_new_session() {
  local command="$1"
  python3 -c 'import os, sys; os.setsid(); os.execvp("bash", ["bash", "-c", sys.argv[1]])' "$command" &
  SPAWNED_PID=$!
}

cleanup() {
  if [ -n "${BACKEND_PID:-}" ]; then
    kill -TERM -- "-$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID:-}" ]; then
    kill -TERM -- "-$FRONTEND_PID" 2>/dev/null || true
  fi
  sleep 2
  if [ -n "${BACKEND_PID:-}" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill -KILL -- "-$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID:-}" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill -KILL -- "-$FRONTEND_PID" 2>/dev/null || true
  fi
  wait 2>/dev/null || true
}

# Start backend (FastAPI)
echo "→ Starting backend (FastAPI) on http://localhost:8000"
cd "$ROOT_DIR/backend"
spawn_in_new_session 'ENVIRONMENT=development exec uv run uvicorn main:app --reload'
BACKEND_PID=$SPAWNED_PID

# Start frontend (Next.js)
echo "→ Starting frontend (Next.js) on http://localhost:9002"
cd "$ROOT_DIR/frontend"
spawn_in_new_session 'exec pnpm dev'
FRONTEND_PID=$SPAWNED_PID

echo ""
echo "EcoPlay is running:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:9002"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for either process to exit
trap 'cleanup; exit 0' INT TERM EXIT
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done
