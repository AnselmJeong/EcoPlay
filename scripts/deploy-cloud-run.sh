#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly PROJECT_ID="${PROJECT_ID:-ecoplay-6fd53}"
readonly REGION="${REGION:-asia-northeast3}"
readonly SERVICE_NAME="${SERVICE_NAME:-ecoplay-api}"
readonly SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-ecoplay-api@ecoplay-6fd53.iam.gserviceaccount.com}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud is required. Use Google Cloud Shell or install the Google Cloud CLI." >&2
  exit 1
fi

if [[ -z "${CORS_ORIGINS:-}" ]]; then
  echo "CORS_ORIGINS is required." >&2
  echo "Example: CORS_ORIGINS=https://ecoplay-web--ecoplay-6fd53.asia-east1.hosted.app $0" >&2
  exit 1
fi

gcloud run deploy "${SERVICE_NAME}" \
  --source "${REPO_ROOT}/backend" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --service-account "${SERVICE_ACCOUNT}" \
  --min-instances 0 \
  --max-instances 2 \
  --memory 512Mi \
  --set-env-vars "^@^ENVIRONMENT=production@CORS_ORIGINS=${CORS_ORIGINS}"
