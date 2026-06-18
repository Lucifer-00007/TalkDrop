import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getAdminClaims } from '@/lib/admin-access'

export const useAdminAccess = () => {
  const { user, loading: authLoading, signOut } = useAuth()
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
        }
        return
      }

      setAdminLoading(true)

      try {
        const claims = await getAdminClaims(user, true)
        if (!cancelled) {
          setIsAdmin(claims.isAdmin)
          setAdminRole(claims.adminRole ?? null)
        }
      } catch (error) {
        console.error('[Admin Access] Failed to verify admin access:', error)
        if (!cancelled) {
          setIsAdmin(false)
          setAdminRole(null)
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

  return {
    user,
    isAdmin,
    adminRole,
    loading: authLoading || adminLoading,
    isAnonymous: !!user?.isAnonymous,
    signOut,
  }
}
