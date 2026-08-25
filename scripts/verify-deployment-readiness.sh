#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly BUILD_OUTPUT="$(mktemp -d)"

cleanup() {
  rm -rf "${BUILD_OUTPUT}"
}
trap cleanup EXIT

for command_name in uv pnpm docker; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "Required command is not installed: ${command_name}" >&2
    exit 1
  fi
done

uv sync --directory "${REPO_ROOT}/backend" --locked --dev
uv run --directory "${REPO_ROOT}/backend" pytest -q
uv run --directory "${REPO_ROOT}/backend" \
  pip-audit --path .venv/lib/python3.13/site-packages --skip-editable
uv build --directory "${REPO_ROOT}/backend" --out-dir "${BUILD_OUTPUT}"

pnpm --dir "${REPO_ROOT}/frontend" install --frozen-lockfile
pnpm --dir "${REPO_ROOT}/frontend" typecheck
pnpm --dir "${REPO_ROOT}/frontend" lint
pnpm --dir "${REPO_ROOT}/frontend" audit --prod
pnpm --dir "${REPO_ROOT}/frontend" build

docker build --tag ecoplay-api:preflight "${REPO_ROOT}/backend"
docker run --rm \
  --env ENVIRONMENT=production \
  --env CORS_ORIGINS=https://ecoplay.example \
  ecoplay-api:preflight \
  sh -c '
    uvicorn main:app --host 0.0.0.0 --port 8080 &
    server_pid=$!
    trap "kill ${server_pid}" EXIT
    for attempt in $(seq 1 20); do
      if python -c "import urllib.request; urllib.request.urlopen(\"http://127.0.0.1:8080/health\").read()" 2>/dev/null; then
        exit 0
      fi
      sleep 1
    done
    exit 1
  '
