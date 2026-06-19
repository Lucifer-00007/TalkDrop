'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Save, Database, Shield, Clock, RefreshCw, Info } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { getAdminReadErrorMessage, getAdminActionErrorMessage } from '@/lib/admin-errors'
import { DEFAULT_SETTINGS } from '@/constants'

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [rooms, setRooms] = useState<Array<{ id: string; retention: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRooms = async () => {
    setLoading(true)
    setError(null)

    try {
      const firestoreInstance = firestore()
      if (!firestoreInstance) {
        const errorMsg = 'Firestore is not available in this session.'
        setError(errorMsg)
        toast({
          title: 'Failed to load rooms',
          description: errorMsg,
          variant: 'destructive',
        })
        return
      }

      const snapshot = await getDocs(collection(firestoreInstance, 'rooms'))
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, retention: '24' })))
      
      toast({
        title: 'Rooms loaded',
        description: `Successfully loaded ${snapshot.docs.length} rooms.`,
      })
    } catch (error) {
      console.error('Failed to load rooms:', error)
      setRooms([])
      const errorMsg = getAdminReadErrorMessage(error)
      setError(errorMsg)
      toast({
        title: 'Failed to load rooms',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    try {
      // In a real app, save to Firebase/backend
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: 'Failed to save settings',
        description: getAdminActionErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1.5">
          Configure platform behavior and security options
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This page displays UI-only configuration placeholders. Real data protection is enforced by Firebase security rules.
        </AlertDescription>
      </Alert>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Management Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Control how messages and rooms are stored and cleaned up</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message Retention */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Message Retention Period</label>
              <Select 
                value={settings.messageRetention} 
                onValueChange={(v) => setSettings({...settings, messageRetention: v})}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours (recommended)</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Messages older than this period will be automatically deleted from the database</p>
            </div>

            <Separator />

            {/* Auto-delete Inactive Rooms */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold">Auto-delete Inactive Rooms</label>
                <p className="text-xs text-muted-foreground">Automatically remove rooms with no recent activity</p>
              </div>
              <Switch 
                checked={settings.autoDeleteInactive} 
                onCheckedChange={(v) => setSettings({...settings, autoDeleteInactive: v})} 
              />
            </div>

            {settings.autoDeleteInactive && (
              <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                <label className="text-sm font-semibold">Inactivity Threshold (days)</label>
                <Input 
                  type="number" 
                  value={settings.inactiveThreshold} 
                  onChange={(e) => setSettings({...settings, inactiveThreshold: e.target.value})}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">Rooms inactive for this many days will be deleted</p>
              </div>
            )}

            <Separator />

            {/* Per-Room Retention */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Per-Room Retention Override</label>
                <Button variant="outline" size="sm" onClick={loadRooms} disabled={loading} className="gap-2">
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Load Rooms
                </Button>
              </div>
              {rooms.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto p-4 rounded-lg border bg-muted/30">
                  {rooms.map((room) => (
                    <div key={room.id} className="flex items-center gap-3 p-2 rounded-md bg-background">
                      <span className="text-sm text-muted-foreground font-mono flex-1 truncate">{room.id}</span>
                      <Select 
                        value={room.retention} 
                        onValueChange={(v) => setRooms(rooms.map(r => r.id === room.id ? {...r, retention: v} : r))}
                      >
                        <SelectTrigger className="h-8 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="12">12 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                          <SelectItem value="72">3 days</SelectItem>
                          <SelectItem value="168">7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Click &ldquo;Load Rooms&rdquo; to configure individual room settings</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>Authentication and permission settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold">Allow Anonymous Users</label>
                <p className="text-xs text-muted-foreground">Users can join rooms without authentication</p>
              </div>
              <Switch 
                checked={settings.allowAnonymous} 
                onCheckedChange={(v) => setSettings({...settings, allowAnonymous: v})} 
              />
            </div>

            <Separator />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold">Require Message Moderation</label>
                <p className="text-xs text-muted-foreground">Admin approval needed before messages appear</p>
              </div>
              <Switch 
                checked={settings.requireModeration} 
                onCheckedChange={(v) => setSettings({...settings, requireModeration: v})} 
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-semibold">Maximum Room Size</label>
              <Input 
                type="number" 
                value={settings.maxRoomSize} 
                onChange={(e) => setSettings({...settings, maxRoomSize: e.target.value})}
                className="max-w-xs"
                min="1"
                max="1000"
              />
              <p className="text-xs text-muted-foreground">Maximum number of concurrent users per room</p>
            </div>
          </CardContent>
        </Card>

        {/* Message Settings Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <CardTitle>Message Settings</CardTitle>
                <CardDescription>Configure message behavior and limits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold">Maximum Message Length</label>
              <Input 
                type="number" 
                value={settings.maxMessageLength} 
                onChange={(e) => setSettings({...settings, maxMessageLength: e.target.value})}
                className="max-w-xs"
                min="1"
                max="10000"
              />
              <p className="text-xs text-muted-foreground">Maximum characters allowed per message</p>
            </div>

            <Separator />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold">Enable Notifications</label>
                <p className="text-xs text-muted-foreground">Receive admin notifications for important events</p>
              </div>
              <Switch 
                checked={settings.enableNotifications} 
                onCheckedChange={(v) => setSettings({...settings, enableNotifications: v})} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
