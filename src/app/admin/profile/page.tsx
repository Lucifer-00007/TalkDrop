'use client'

import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')

  const handleSignOut = async () => {
    const authInstance = auth()
    if (authInstance) {
      await authInstance.signOut()
      router.push('/')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'AD'
  const createdAt = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : 'N/A'

  return (
    <AdminLayout>
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your admin account</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold">{user?.email || 'Admin'}</h2>
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Administrator Account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">{createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{user?.uid}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Name</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <Button disabled>Update</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This name will be displayed in the admin panel
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-muted-foreground">
                      Sign out from your admin account
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
