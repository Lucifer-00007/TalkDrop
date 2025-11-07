import { signInAnonymously, User } from 'firebase/auth'
import { auth } from './firebase'

export const signInAnonymous = async (): Promise<User> => {
  const authInstance = auth()
  if (!authInstance) {
    throw new Error('Firebase auth not initialized')
  }
  const result = await signInAnonymously(authInstance)
  return result.user
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}