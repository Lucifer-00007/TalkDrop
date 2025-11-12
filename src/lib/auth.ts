import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from './firebase'
import { ALLOWED_ADMIN_EMAILS } from '@/constants'

const validateAdminEmail = (email: string | null) => {
  if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
    throw new Error('Unauthorized: This email is not allowed to access the admin panel')
  }
}

export const getAuthErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error)
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
    return 'Invalid credentials'
  }
  if (message.includes('Unauthorized')) {
    return message
  }
  return 'Authentication failed. Please try again.'
}

export const signInAnonymous = async (): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) {
    throw new Error('Firebase auth not initialized')
  }
  const result = await signInAnonymously(authInstance)
  return result.user
}

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  validateAdminEmail(email)
  const result = await signInWithEmailAndPassword(authInstance, email, password)
  return result.user
}

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  validateAdminEmail(email)
  const result = await createUserWithEmailAndPassword(authInstance, email, password)
  return result.user
}

export const signInWithGoogle = async (): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const provider = new GoogleAuthProvider()
  console.log('[Auth] Starting Google sign-in...')
  const result = await signInWithPopup(authInstance, provider)
  console.log('[Auth] Google sign-in successful, email:', result.user.email)
  try {
    validateAdminEmail(result.user.email)
    console.log('[Auth] Email validated successfully')
    return result.user
  } catch (error) {
    console.error('[Auth] Email validation failed:', error)
    await authInstance.signOut()
    throw error
  }
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}