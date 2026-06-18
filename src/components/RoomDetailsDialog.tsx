'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AdminRoomData } from '@/lib/admin-rooms'
import { Users, MessageSquare, Calendar, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RoomDetailsDialogProps {
  room: AdminRoomData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomDetailsDialog({ room, open, onOpenChange }: RoomDetailsDialogProps) {
  if (!room) return null

  const onlineUsers = room.users.filter(u => u.online)
  const offlineUsers = room.users.filter(u => !u.online)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Room Details
            <Badge variant={room.status === 'active' ? 'default' : 'secondary'}>
              {room.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Name</p>
              <p className="text-lg font-semibold">{room.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room ID</p>
              <p className="font-mono text-sm">{room.id}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-xl font-bold">{room.userCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-xl font-bold">{room.messageCount}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {room.createdAt ? room.createdAt.toLocaleString() : 'Unknown'}
              </span>
            </div>
            {room.lastMessageAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last message:</span>
                <span className="font-medium">
                  {formatDistanceToNow(room.lastMessageAt, { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          {/* Users List */}
          <div>
            <h3 className="font-semibold mb-3">Users ({room.users.length})</h3>
            
            {room.users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No users have joined this room yet</p>
            ) : (
              <div className="space-y-4">
                {onlineUsers.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                      Online ({onlineUsers.length})
                    </p>
                    <div className="space-y-2">
                      {onlineUsers.map((user) => (
                        <div
                          key={user.uid}
                          className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                        >
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs">
                                {user.displayName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{user.uid}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {offlineUsers.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                      Offline ({offlineUsers.length})
                    </p>
                    <div className="space-y-2">
                      {offlineUsers.map((user) => (
                        <div
                          key={user.uid}
                          className="flex items-center gap-3 p-2 rounded-lg border bg-card opacity-60"
                        >
                          <div className="relative">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs">
                                {user.displayName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">{user.uid}</p>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(user.lastSeen, { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
