import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from './firebase'
import { ALLOWED_ADMIN_EMAILS } from '@/constants'

const validateAdminEmail = (email: string | null) => {
  if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
    throw new Error('Unauthorized: This email is not allowed to access the admin panel')
  }
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
  const result = await signInWithPopup(authInstance, provider)
  try {
    validateAdminEmail(result.user.email)
    return result.user
  } catch (error) {
    await authInstance.signOut()
    throw error
  }
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}