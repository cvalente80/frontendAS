import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

// Initialize once (HMR-safe)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core SDKs
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Sign in with Google (popup by default; redirect optional)
export async function signInWithGoogle(options?: { redirect?: boolean }) {
  if (typeof window === "undefined") return null;
  try {
    if (options?.redirect) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (e: any) {
    if (e?.code === "auth/configuration-not-found") {
      console.error(
        "Firebase Auth: Google provider not configured. Enable Google in Firebase Console (Authentication > Sign-in method) and add your domain to Authorized domains."
      );
    }
    throw e;
  }
}

export const signOutUser = () => signOut(auth);

// Optional, browser-only analytics (lazy)
export let analyticsPromise:
  | Promise<import("firebase/analytics").Analytics | null>
  | null = null;
if (typeof window !== "undefined" && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  analyticsPromise = (async () => {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    return (await isSupported()) ? getAnalytics(app) : null;
  })();
}
