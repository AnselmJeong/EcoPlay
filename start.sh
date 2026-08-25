#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

stop_port() {
  local port="$1"
  local service_name="$2"
  local listener_pids
  local attempt

  listener_pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -z "$listener_pids" ]; then
    return
  fi

  echo "→ Port $port is already in use; stopping the existing $service_name listener:"
  lsof -iTCP:"$port" -sTCP:LISTEN -n -P || true

  while IFS= read -r listener_pid; do
    if [ -n "$listener_pid" ]; then
      kill -TERM "$listener_pid" 2>/dev/null || true
    fi
  done <<< "$listener_pids"

  for attempt in 1 2 3 4 5 6 7 8; do
    if ! lsof -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "  Port $port released."
      return
    fi
    sleep 0.25
  done

  echo "  Listener did not stop gracefully; forcing it to exit."
  listener_pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  while IFS= read -r listener_pid; do
    if [ -n "$listener_pid" ]; then
      kill -KILL "$listener_pid" 2>/dev/null || true
    fi
  done <<< "$listener_pids"

  sleep 0.25
  if lsof -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Error: failed to release port $port for $service_name."
    lsof -iTCP:"$port" -sTCP:LISTEN -n -P || true
    exit 1
  fi

  echo "  Port $port released."
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

stop_port 8000 "backend"
stop_port 9000 "frontend"

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
echo "→ Starting frontend (Next.js) on http://localhost:9000"
cd "$ROOT_DIR/frontend"
spawn_in_new_session 'exec pnpm dev'
FRONTEND_PID=$SPAWNED_PID

echo ""
echo "EcoPlay is running:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:9000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for either process to exit
trap 'cleanup; exit 0' INT TERM EXIT
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done
