import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getDatabase, Database, connectDatabaseEmulator } from 'firebase/database'
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { isFirebaseConfigured, FIREBASE_CONFIG_MISSING_MESSAGE } from './config'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let rtdb: Database | null = null
let firestore: Firestore | null = null
let initialized = false

const initializeFirebase = () => {
  if (initialized || typeof window === 'undefined') return
  
  console.log('[Firebase] Initializing...')
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
  console.log('[Firebase] Use emulator:', useEmulator)
  
  let firebaseConfig
  if (useEmulator) {
    // Use demo config for emulators
    firebaseConfig = {
      apiKey: 'demo-api-key',
      authDomain: 'demo-project.firebaseapp.com',
      projectId: 'demo-project',
      databaseURL: 'http://127.0.0.1:9000/?ns=demo-project-default-rtdb',
      storageBucket: 'demo-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456',
    }
  } else {
    if (!isFirebaseConfigured()) {
      console.error('[Firebase] Configuration missing:', FIREBASE_CONFIG_MISSING_MESSAGE)
      return
    }
    console.log('[Firebase] Using production config')
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    }
  }

  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    rtdb = getDatabase(app)
    firestore = getFirestore(app)
    console.log('[Firebase] Initialized successfully')
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error)
    return
  }

  // Set auth persistence
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to set auth persistence:', error)
  })

  // Connect to emulators in development
  if (useEmulator) {
    try {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099')
      connectDatabaseEmulator(rtdb, '127.0.0.1', 9000)
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
      console.log('🔥 Connected to Firebase Emulators')
    } catch {
      console.log('Emulators already connected or not available')
    }
  }
  
  initialized = true
  console.log('[Firebase] Setup complete')
}

const getFirebaseAuth = () => {
  initializeFirebase()
  return auth
}

const getFirebaseRTDB = () => {
  initializeFirebase()
  return rtdb
}

const getFirebaseFirestore = () => {
  initializeFirebase()
  return firestore
}

export { getFirebaseAuth as auth, getFirebaseRTDB as rtdb, getFirebaseFirestore as firestore, isFirebaseConfigured }
export default app