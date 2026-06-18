'use client'

import { useState, useEffect } from 'react'
import { ShieldAlert, LogOut, UserX } from 'lucide-react'
import { Button } from './ui/button'
import AdminAuth from './AdminAuth'
import AdminLayout from './AdminLayout'
import { Toaster } from './ui/toaster'
import { AdminLoginSkeleton, AdminAppSkeleton, AdminBootSkeleton } from './AdminSkeletons'
import { useAdminAccess, wasAdminAuthenticated } from '@/hooks/useAdminAccess'
import { useRouter } from 'next/navigation'

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, adminRole, loading, isAnonymous, signOut } = useAdminAccess()
  const router = useRouter()
  const [authError, setAuthError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    if (!mounted) return <AdminBootSkeleton />
    return wasAdminAuthenticated() ? <AdminAppSkeleton /> : <AdminLoginSkeleton />
  }

  if (!user || isAnonymous) {
    if (isAnonymous && user) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <UserX className="h-6 w-6 text-amber-600 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <h1 className="text-xl font-semibold">Guest sessions cannot access admin</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are currently signed in anonymously. Sign out of the guest session, then sign in with an account that has the Firebase admin claim.
                  </p>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Current guest user ID</p>
                  <p className="text-sm font-mono break-all">{user.uid}</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={signOut} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Go Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return <AdminAuth authError={authError} onAuthError={setAuthError} />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-destructive mt-0.5" />
            <div className="space-y-3">
              <div>
                <h1 className="text-xl font-semibold">Admin access denied</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  This account is signed in, but it does not currently have the required admin claim.
                </p>
              </div>
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Current user ID</p>
                <p className="text-sm font-mono break-all">{user.uid}</p>
              </div>
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Current role claim</p>
                <p className="text-sm font-mono break-all">{adminRole || 'none'}</p>
              </div>
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">How to grant access</p>
                <p className="text-sm">
                  Grant this account the Firebase custom claim `isAdmin: true`, then sign in again or refresh the ID token.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </>
  )
}
