import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from './firebase'

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
  const result = await signInWithEmailAndPassword(authInstance, email, password)
  return result.user
}

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const result = await createUserWithEmailAndPassword(authInstance, email, password)
  return result.user
}

export const signInWithGoogle = async (): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) throw new Error('Firebase auth not initialized')
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(authInstance, provider)
  return result.user
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}