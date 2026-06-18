import { useEffect, useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getAdminClaims } from '@/lib/admin-access'

const ADMIN_AUTH_FLAG = 'adminAuthState'

export const wasAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_AUTH_FLAG) === 'true'
}

export const useAdminAccess = () => {
  const { user, loading: authLoading, signOut: authSignOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [adminRole, setAdminRole] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const checkAccess = async () => {
      if (authLoading) return

      if (!user || user.isAnonymous) {
        if (!cancelled) {
          setIsAdmin(false)
          setAdminRole(null)
          setAdminLoading(false)
          localStorage.removeItem(ADMIN_AUTH_FLAG)
        }
        return
      }

      setAdminLoading(true)

      try {
        const claims = await getAdminClaims(user, true)
        if (!cancelled) {
          setIsAdmin(claims.isAdmin)
          setAdminRole(claims.adminRole ?? null)
          if (claims.isAdmin) {
            localStorage.setItem(ADMIN_AUTH_FLAG, 'true')
          } else {
            localStorage.removeItem(ADMIN_AUTH_FLAG)
          }
        }
      } catch (error) {
        console.error('[Admin Access] Failed to verify admin access:', error)
        if (!cancelled) {
          setIsAdmin(false)
          setAdminRole(null)
          localStorage.removeItem(ADMIN_AUTH_FLAG)
        }
      } finally {
        if (!cancelled) {
          setAdminLoading(false)
        }
      }
    }

    checkAccess()

    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const signOut = useCallback(async () => {
    localStorage.removeItem(ADMIN_AUTH_FLAG)
    await authSignOut()
  }, [authSignOut])

  return {
    user,
    isAdmin,
    adminRole,
    loading: authLoading || adminLoading,
    isAnonymous: !!user?.isAnonymous,
    signOut,
  }
}
