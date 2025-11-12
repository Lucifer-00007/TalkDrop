'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Users as UsersIcon, UserCheck, UserX } from 'lucide-react'
import { rtdb } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'

interface User {
  uid: string
  displayName: string
  lastSeen: number
  status: 'online' | 'offline'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const db = rtdb()
    if (!db) return

    const roomsRef = ref(db, 'rooms')
    
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val()
      const usersMap = new Map<string, User>()
      
      if (data) {
        Object.values(data as Record<string, unknown>).forEach((room) => {
          const roomData = room as Record<string, unknown>
          if (roomData.presence) {
            Object.entries(roomData.presence as Record<string, Record<string, unknown>>).forEach(([uid, userData]) => {
              const existing = usersMap.get(uid)
              if (!existing || (userData.lastSeen && Number(userData.lastSeen) > existing.lastSeen)) {
                usersMap.set(uid, {
                  uid,
                  displayName: String(userData.displayName || 'Anonymous'),
                  lastSeen: Number(userData.lastSeen) || Date.now(),
                  status: userData.online ? 'online' : 'offline',
                })
              }
            })
          }
        })
      }
      
      setUsers(Array.from(usersMap.values()))
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uid.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onlineUsers = filteredUsers.filter(u => u.status === 'online')
  const offlineUsers = filteredUsers.filter(u => u.status === 'offline')

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <UsersIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <UserCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{onlineUsers.length}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <UserX className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{offlineUsers.length}</p>
                    <p className="text-sm text-muted-foreground">Offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {user.displayName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                              user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground font-mono">{user.uid}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
