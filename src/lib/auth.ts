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
    return 'Invalid credentials'
  }
  if (message.includes('Unauthorized')) {
    return message
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
    console.error('[Auth] Admin access validation failed:', error)
    throw error
  }
}

export const getCurrentUser = (): User | null => {
  const authInstance = auth()
  return authInstance?.currentUser || null
}
