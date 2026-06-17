import { useState, useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    
    console.log('[useAuth] Initializing auth...')
    const authInstance = auth()
    
    // Get display name from localStorage
    const savedDisplayName = localStorage.getItem('displayName')
    if (savedDisplayName) {
      setDisplayName(savedDisplayName)
    }

    if (!authInstance) {
      console.error('[useAuth] Firebase auth not initialized')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      console.log('[useAuth] Auth state changed:', firebaseUser?.email || 'no user')
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        // If not signed in to Firebase, check for mock anonymous user
        const anonUid = localStorage.getItem('anonymousUid')
        if (anonUid && savedDisplayName) {
          setUser({ 
            uid: anonUid, 
            isAnonymous: true,
            metadata: { creationTime: new Date().toISOString() } 
          } as unknown as User)
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (name: string) => {
    localStorage.setItem('displayName', name)
    setDisplayName(name)
    
    const authInstance = auth()
    if (authInstance?.currentUser) {
      return authInstance.currentUser
    }
    
    let anonUid = localStorage.getItem('anonymousUid')
    if (!anonUid) {
      anonUid = 'anon_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('anonymousUid', anonUid)
    }
    
    const mockUser = { 
      uid: anonUid, 
      isAnonymous: true,
      metadata: { creationTime: new Date().toISOString() } 
    } as unknown as User
    setUser(mockUser)
    return mockUser
  }

  return {
    user,
    loading,
    displayName,
    signIn,
    isAuthenticated: !!user
  }
}