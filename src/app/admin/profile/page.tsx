'use client'

import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, Shield, Calendar, LogOut, Edit2, Copy, Check } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{user?.email || 'Admin'}</h2>
                        <Badge variant="default" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Administrator Account</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-background">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                      <p className="text-sm font-medium break-all">{user?.email || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-background">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Account Created</p>
                      <p className="text-sm font-medium">{createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-background">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">User ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium font-mono break-all flex-1">{user?.uid}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(user?.uid || '')}
                        >
                          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5" />
                  Display Name
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1"
                  />
                  <Button disabled className="gap-2">
                    <Check className="h-4 w-4" />
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This name will be displayed in the admin panel
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20">
                  <div>
                    <p className="font-semibold">Sign Out</p>
                    <p className="text-sm text-muted-foreground">
                      Sign out from your admin account
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleSignOut} className="gap-2">
                    <LogOut className="h-4 w-4" />
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
