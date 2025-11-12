'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, Database, Shield, Clock, Bell, RefreshCw } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { DEFAULT_SETTINGS } from '@/constants'

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [rooms, setRooms] = useState<Array<{ id: string; retention: string }>>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadRooms = async () => {
    setLoading(true)
    try {
      const firestoreInstance = firestore()
      if (!firestoreInstance) {
        setLoading(false)
        return
      }
      
      const snapshot = await getDocs(collection(firestoreInstance, 'rooms'))
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, retention: '24' })))
    } catch (error) {
      console.error('Failed to load rooms:', error)
      setRooms([])
    }
    setLoading(false)
  }



  const handleSave = () => {
    // In a real app, save to Firebase/backend
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your TalkDrop instance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Data Management</CardTitle>
              </div>
              <CardDescription>Control how messages and rooms are stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <label className="text-sm font-medium">Message Retention Period</label>
                <Select value={settings.messageRetention} onValueChange={(v) => setSettings({...settings, messageRetention: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Messages older than this will be automatically deleted</p>
              </div>

              <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto-delete Inactive Rooms</label>
                  <p className="text-xs text-muted-foreground">Remove rooms with no activity</p>
                </div>
                <Switch checked={settings.autoDeleteInactive} onCheckedChange={(v) => setSettings({...settings, autoDeleteInactive: v})} />
              </div>

              {settings.autoDeleteInactive && (
                <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <label className="text-sm font-medium">Inactivity Threshold (days)</label>
                  <Input type="number" value={settings.inactiveThreshold} onChange={(e) => setSettings({...settings, inactiveThreshold: e.target.value})} />
                </div>
              )}

              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Per-Room Retention</label>
                  <Button variant="ghost" size="sm" onClick={loadRooms} disabled={loading} className="h-7 w-7 p-0">
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rooms.map((room) => (
                    <div key={room.id} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground min-w-24 truncate">{room.id}</span>
                      <Select value={room.retention} onValueChange={(v) => setRooms(rooms.map(r => r.id === room.id ? {...r, retention: v} : r))}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1h</SelectItem>
                          <SelectItem value="6">6h</SelectItem>
                          <SelectItem value="12">12h</SelectItem>
                          <SelectItem value="24">24h</SelectItem>
                          <SelectItem value="48">48h</SelectItem>
                          <SelectItem value="72">3d</SelectItem>
                          <SelectItem value="168">7d</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security & Access</CardTitle>
              </div>
              <CardDescription>Manage authentication and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Allow Anonymous Users</label>
                  <p className="text-xs text-muted-foreground">Users can join without authentication</p>
                </div>
                <Switch checked={settings.allowAnonymous} onCheckedChange={(v) => setSettings({...settings, allowAnonymous: v})} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Require Message Moderation</label>
                  <p className="text-xs text-muted-foreground">Admin approval needed for messages</p>
                </div>
                <Switch checked={settings.requireModeration} onCheckedChange={(v) => setSettings({...settings, requireModeration: v})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Room Size</label>
                <Input type="number" value={settings.maxRoomSize} onChange={(e) => setSettings({...settings, maxRoomSize: e.target.value})} />
                <p className="text-xs text-muted-foreground">Maximum number of users per room</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Message Settings</CardTitle>
              </div>
              <CardDescription>Configure message behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Message Length</label>
                <Input type="number" value={settings.maxMessageLength} onChange={(e) => setSettings({...settings, maxMessageLength: e.target.value})} />
                <p className="text-xs text-muted-foreground">Maximum characters per message</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Admin Notifications</label>
                  <p className="text-xs text-muted-foreground">Get notified of important events</p>
                </div>
                <Switch checked={settings.enableNotifications} onCheckedChange={(v) => setSettings({...settings, enableNotifications: v})} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          {saved && <Badge variant="default">Settings saved!</Badge>}
        </div>
      </div>
    </AdminLayout>
  )
}
