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

const missingFirebaseConfig = Object.entries(requiredFirebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseConfig.length > 0) {
  throw new Error(
    `Firebase config is missing required values: ${missingFirebaseConfig.join(', ')}. ` +
    'Set NEXT_PUBLIC_FIREBASE_* in .env.local or apphosting.yaml at build time and rebuild.'
  );
}

// Use the reviewed build-time config. App Hosting's automatic SDK defaults can
// still contain an old API key after rotation, so never fall back to them.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firestore access is intentionally handled by the authenticated backend only.
export const auth: Auth | null = typeof window !== 'undefined' ? getAuth(app) : null;
export default app;
