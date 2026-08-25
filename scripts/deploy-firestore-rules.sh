#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly PROJECT_ID="${PROJECT_ID:-ecoplay-6fd53}"

if ! command -v firebase >/dev/null 2>&1; then
  echo "Firebase CLI is required: npm install -g firebase-tools" >&2
  exit 1
fi

firebase deploy \
  --config "${REPO_ROOT}/firebase.json" \
  --project "${PROJECT_ID}" \
  --only firestore:rules
