# Firebase Deployment Readiness Plan

## Scope

Prepare EcoPlay for Firebase App Hosting, Cloud Run, Firebase Authentication,
and Cloud Firestore without creating or modifying cloud resources.

## Checklist

- [x] Use Application Default Credentials on Cloud Run and a local key only for development.
- [x] Run FastAPI on Cloud Run's injected `PORT` as a non-root container user.
- [x] Require explicit production authentication and participant ownership checks.
- [x] Configure production CORS through `CORS_ORIGINS`.
- [x] Require the production API URL in the Next.js build.
- [x] Deny direct browser access with Firestore Security Rules.
- [x] Pin the Firebase CLI project alias to `ecoplay-6fd53`.
- [x] Add repeatable preflight and deployment scripts.
- [x] Add CI checks for the backend, Cloud Run image, and App Hosting frontend.
- [x] Audit production dependency graphs and apply patched versions.
- [ ] Complete the Firebase and Google Cloud Console actions in `Firebase Hosting.md`.
- [ ] Deploy and run the end-to-end participant smoke test.

## Safety Boundary

The remaining unchecked steps require billing, IAM, GitHub authorization, or a
live deployment. They must be performed by a project owner after reviewing the
commands and target project.
