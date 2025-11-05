/// <reference types="vite/client" />
import { initializeApp, setLogLevel, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  inMemoryPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

// Replace direct initializeApp with singleton init
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Reduce SDK logs (guarded to avoid older SDK issues)
try {
  setLogLevel("error");
} catch {
  // ignore
}

// Initialize Auth with popup resolver only; avoid persistence here
export const auth = (() => {
  try {
    if (typeof window === "undefined") {
      return getAuth(app);
    }
    return initializeAuth(app, {
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    return getAuth(app);
  }
})();

// Set UI language to Portuguese
auth.languageCode = "pt";

// Set persistence after auth is ready (fallback to in-memory)
async function ensureAuthPersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch {
      // ignore if even in-memory is unavailable
    }
  }
}

// Run persistence setup non-blocking in the browser
if (typeof window !== "undefined") {
  // No await to avoid blocking initial render
  ensureAuthPersistence().catch(() => {});
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Try popup first; fallback to redirect on COOP/popup issues
export async function signInWithGoogle() {
  if (typeof window === "undefined") return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (e: any) {
    const msg = String(e?.message || "");
    const code = String(e?.code || "");
    const coopIssue =
      msg.includes("Cross-Origin-Opener-Policy") ||
      msg.includes("window.closed") ||
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request";
    if (coopIssue) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw e;
  }
}

// Complete redirect flow after return (guard non-browser)
export async function handleAuthRedirect() {
  if (typeof window === "undefined") return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      try {
        await result.user.reload();
      } catch {
        // ignore reload failures
      }
      return result.user;
    }
    return null;
  } catch {
    return null;
  }
}

export const signOutUser = () => signOut(auth);

// Firestore singleton
export const db = getFirestore(app);

// Email/password auth helpers
export async function signInWithEmailPassword(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function registerWithEmailPassword(email: string, password: string) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}