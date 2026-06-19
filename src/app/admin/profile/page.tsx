'use client'

import { useAdminAccess } from '@/hooks/useAdminAccess'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Mail, Shield, Calendar, LogOut, Edit2, Copy, Check, User as UserIcon } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AdminProfileSkeleton } from '@/components/AdminSkeletons'

export default function ProfilePage() {
  const { user, adminRole, loading } = useAdminAccess()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)

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
    return <AdminProfileSkeleton />
  }

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'AD'
  const createdAt = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : 'N/A'

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1.5">Manage your admin account and preferences</p>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your admin account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-4 border-background" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">{user?.email || 'Admin User'}</h2>
                <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                  <Shield className="h-3 w-3" />
                  {adminRole || 'Administrator'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Firebase custom claim: <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">isAdmin: true</code></p>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <Separator />

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Email */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Email Address</p>
                    <p className="text-sm font-semibold break-all">{user?.email || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Created */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Account Created</p>
                    <p className="text-sm font-semibold">{createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User ID */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">User ID</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold font-mono truncate flex-1">{user?.uid}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => copyToClipboard(user?.uid || '')}
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Edit2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Display Name</CardTitle>
                <CardDescription>Update how your name appears in the admin panel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold">Display Name</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1"
                  disabled={!editing}
                />
                {editing ? (
                  <>
                    <Button className="gap-2">
                      <Check className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                This name will be displayed throughout the admin interface
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background">
              <div className="space-y-1">
                <p className="font-semibold">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  End your current admin session
                </p>
              </div>
              <Button variant="destructive" onClick={handleSignOut} className="gap-2 border-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Current session details and security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Authentication Method</span>
              <Badge variant="secondary">Firebase Auth</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Admin Status</span>
              <Badge className="bg-green-600">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Session Type</span>
              <Badge variant="secondary">Web</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Security Level</span>
              <Badge className="bg-green-600">High</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
