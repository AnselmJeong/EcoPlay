import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const requiredFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfig = {
  ...requiredFirebaseConfig,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const hasExplicitFirebaseConfig = Object.values(requiredFirebaseConfig).every(Boolean);

// Firebase App Hosting injects FIREBASE_WEBAPP_CONFIG during the build and
// exposes it as the SDK's default configuration. Explicit NEXT_PUBLIC values
// remain supported for local development and non-App Hosting environments.
const app = getApps().length > 0
  ? getApp()
  : hasExplicitFirebaseConfig
    ? initializeApp(firebaseConfig)
    : initializeApp();

// Firestore access is intentionally handled by the authenticated backend only.
export const auth: Auth | null = typeof window !== 'undefined' ? getAuth(app) : null;
export default app;
