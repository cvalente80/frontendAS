// Firebase exports
// Make sure to create a .env file with your Firebase credentials using Vite prefix VITE_
// Required envs:
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

// Re-export Firebase singletons and helpers from the central module to avoid duplicate init.
// ...remove any local initializeApp/auth setup...
export {
  auth,
  googleProvider,
  signInWithGoogle,
  handleAuthRedirect,
  signOutUser,
  db,
} from "../typescript";
