import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from './firebase'
import { hasAdminAccess } from './admin-access'

const ensureAdminUser = async (user: User) => {
  if (user.isAnonymous) {
    const authInstance = auth()
    await authInstance?.signOut()
    throw new Error('Unauthorized: Anonymous users cannot access the admin panel')
  }

  const allowed = await hasAdminAccess(user, true)
  if (!allowed) {
    const authInstance = auth()
    await authInstance?.signOut()
    throw new Error('Unauthorized: This account is missing the required admin claim')
  }

  return user
}

export const getAuthErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }
  if (message.includes('auth/popup-closed-by-user') || message.includes('auth/cancelled-popup-request')) {
    return 'Sign-in was cancelled. Please try again.'
  }
  if (message.includes('auth/popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.'
  }
  if (message.includes('auth/network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.'
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Too many sign-in attempts. Please try again later.'
  }
  if (message.includes('Anonymous users cannot access')) {
    return 'Guest sessions cannot access the admin panel. Please sign in with an admin account.'
  }
  if (message.includes('missing the required admin claim')) {
    return 'This account does not have admin access. Grant the admin claim using "npm run admin:claims -- grant <your-email>", then sign in again.'
  }
  if (message.includes('Firebase auth not initialized')) {
    return 'Authentication is not available. Please check your Firebase configuration.'
  }

  return 'Authentication failed. Please try again.'
}

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const result = await signInWithEmailAndPassword(authInstance, email, password)
  return ensureAdminUser(result.user)
}

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const result = await createUserWithEmailAndPassword(authInstance, email, password)
  return ensureAdminUser(result.user)
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}

export const signInWithGoogle = async (): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const provider = new GoogleAuthProvider()
  console.log('[Auth] Starting Google sign-in...')
  const result = await signInWithPopup(authInstance, provider)
  console.log('[Auth] Google sign-in successful, uid:', result.user.uid)
  try {
    const user = await ensureAdminUser(result.user)
    console.log('[Auth] Admin access validated successfully')
    return user
  } catch (error) {
    console.warn('[Auth] Admin access validation failed:', error instanceof Error ? error.message : error)
    throw error
  }
}
