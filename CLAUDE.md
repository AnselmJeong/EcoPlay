# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EcoPlay is a research platform for economic psychology experiments using game theory (Public Goods Game and Trust Game) to study trust and cooperation. The UI is primarily in Korean.

## Tech Stack

- **Frontend:** Next.js 15.3.3 (App Router, Turbopack), TypeScript, Tailwind CSS, shadcn/ui, Firebase 11, Recharts, Genkit AI
- **Backend:** FastAPI 0.115.12, Python 3.13+, Firebase Admin SDK
- **Package Manager:** pnpm 10.4.1 (frontend), UV (backend)

## Commands

### Frontend
```bash
cd frontend
pnpm dev              # Dev server on port 9002
pnpm build            # Production build
pnpm lint             # Lint
pnpm typecheck        # TypeScript check
pnpm genkit:dev       # Genkit AI dev server
```

### Backend
```bash
cd backend
uvicorn main:app --reload   # FastAPI dev server on port 8000
```

## Architecture

### Authentication
Users authenticate with medical record number (8 digits) + birth date (YYYYMMDD). These are transformed to Firebase Auth credentials: email = `{medicalRecordNumber}@eco.play`, password = birth date.

### Game Flow
1. Landing page → Consent page → Games hub
2. **Public Goods Game:** User donates to common pool, 4 AI players contribute randomly, returns distributed proportionally
3. **Trust Game:**
   - Receiver (trustee): Receives investment, decides return amount
   - Trustor: Invests amount (3x multiplier), trustee decides return

### API Design
REST API via FastAPI with Firebase ID token verification. Key endpoints:
- `/api/game/*` - Game submission and history
- `/api/consent/*` - Consent form handling
- `/api/match/*` - Opponent matching
- `/api/message/*` - LLM message generation
- `/api/report/*` - Game reports

### Data Storage
Firebase Firestore collections: `basic_info`, `public_goods_game`, `trust_game`, `game_matches`, `questionnaire`

### CORS Configuration
Backend allows `localhost:3000` (production) and `localhost:9002` (development).

## Environment Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ecoplay-6fd53.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ecoplay-6fd53
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ecoplay-6fd53.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=749750779389
NEXT_PUBLIC_FIREBASE_APP_ID=1:749750779389:web:...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend
- Firebase service account at `backend/secret/ecoplay.json`
- `ENVIRONMENT=development` env var enables dev token bypass for local testing

## Design System

- **Primary:** Soft blue (#A0D2EB)
- **Background:** Very light blue (#F0F8FF)
- **Accent:** Pale orange (#FFB347)
- **Fonts:** Poppins (headlines), PT Sans (body)
