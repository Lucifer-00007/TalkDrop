'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Search, Users as UsersIcon, UserCheck, UserX, AlertCircle, Filter, Trash2, MoreVertical } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { rtdb } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'
import { getAdminReadErrorMessage, getAdminActionErrorMessage } from '@/lib/admin-errors'
import { deleteUserData } from '@/lib/admin-users'

interface User {
  uid: string
  displayName: string
  lastSeen: number
  status: 'online' | 'offline'
}

type FilterStatus = 'all' | 'online' | 'offline'

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const db = rtdb()
    if (!db) {
      setLoading(false)
      setError('Realtime Database is not available in this session.')
      return
    }

    const roomsRef = ref(db, 'rooms')
    setError(null)

    const unsubscribe = onValue(
      roomsRef,
      (snapshot) => {
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
      },
      (error) => {
        console.error('Failed to load admin users:', error)
        setUsers([])
        setError(getAdminReadErrorMessage(error))
        setLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  // Apply filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const onlineUsers = users.filter(u => u.status === 'online')
  const offlineUsers = users.filter(u => u.status === 'offline')

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setDeleting(true)
    try {
      const result = await deleteUserData(userToDelete.uid)
      
      toast({
        title: 'User deleted',
        description: `Successfully deleted user "${userToDelete.displayName}" and all associated data (${result.deletedPresenceCount} presence records, ${result.deletedMessagesCount} messages).`,
      })
      
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast({
        title: 'Failed to delete user',
        description: getAdminActionErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1.5">Manage and monitor all users across rooms</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-primary/10">
                    <UsersIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{users.length}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-green-500/10">
                    <UserCheck className="h-7 w-7 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{onlineUsers.length}</p>
                    <p className="text-sm text-muted-foreground">Online Now</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-muted">
                    <UserX className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{offlineUsers.length}</p>
                    <p className="text-sm text-muted-foreground">Offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                {searchQuery || filterStatus !== 'all' ? ' (filtered)' : ''}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v: FilterStatus) => setFilterStatus(v)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-lg font-semibold mb-1">No users found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'No users have joined any rooms yet'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-muted">
                        <AvatarFallback className="font-semibold">
                          {user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground font-mono truncate">{user.uid}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={user.status === 'online' ? 'default' : 'secondary'}
                      className={user.status === 'online' ? 'bg-green-600' : ''}
                    >
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground hidden sm:block min-w-[140px] text-right">
                      {new Date(user.lastSeen).toLocaleString()}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Data?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  This will permanently delete all data for user &quot;{userToDelete?.displayName}&quot;, including:
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Presence data from all rooms</li>
                  <li>All messages sent by this user</li>
                  <li>Typing indicators</li>
                </ul>
                <p className="mt-3 font-semibold text-destructive">
                  This action cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2"
            >
              {deleting ? 'Deleting...' : 'Delete User Data'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
