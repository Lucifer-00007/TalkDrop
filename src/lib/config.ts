export const isFirebaseConfigured = () => {
  // Allow emulator mode with demo credentials
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    return true
  }
  
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )
}

export const FIREBASE_CONFIG_MISSING_MESSAGE = `
Firebase is not configured. Please:
1. Create a Firebase project
2. Enable Authentication (Anonymous) and Realtime Database
3. Add your Firebase config to .env.local
4. See FIREBASE_SETUP.md for detailed instructions
`