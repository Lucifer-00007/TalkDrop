import { useState, useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { signInAnonymous } from '@/lib/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    const authInstance = auth()
    if (!authInstance) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Get display name from localStorage
    const savedDisplayName = localStorage.getItem('displayName')
    if (savedDisplayName) {
      setDisplayName(savedDisplayName)
    }

    return unsubscribe
  }, [])

  const signIn = async (displayName: string) => {
    try {
      localStorage.setItem('displayName', displayName)
      setDisplayName(displayName)
      const user = await signInAnonymous()
      return user
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    displayName,
    signIn,
    isAuthenticated: !!user
  }
}