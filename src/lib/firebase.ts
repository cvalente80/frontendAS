import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

// Initialize once (safe with HMR)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core SDKs
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: connect to local emulators when developing
if (typeof window !== 'undefined' && import.meta.env.VITE_USE_FIREBASE_EMULATORS === '1') {
  try {
    // Firestore emulator (default port 8080)
    connectFirestoreEmulator(db, '127.0.0.1', Number(import.meta.env.VITE_EMU_FIRESTORE_PORT || 8080));
  } catch {}
  try {
    // Auth emulator (default port 9099)
    connectAuthEmulator(auth, `http://127.0.0.1:${import.meta.env.VITE_EMU_AUTH_PORT || 9099}`);
  } catch {}
  try {
    // Storage emulator (default port 9199)
    connectStorageEmulator(storage, '127.0.0.1', Number(import.meta.env.VITE_EMU_STORAGE_PORT || 9199));
  } catch {}
}

// Lazy, browser-only Analytics
export let analyticsPromise:
  | Promise<import("firebase/analytics").Analytics | null>
  | null = null;

if (typeof window !== "undefined" && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  analyticsPromise = (async () => {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    return (await isSupported()) ? getAnalytics(app) : null;
  })();
}
