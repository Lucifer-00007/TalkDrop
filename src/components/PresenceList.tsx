'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  displayName: string
  online: boolean
  lastSeen: number
}

interface PresenceListProps {
  users: User[]
}

export default function PresenceList({ users }: PresenceListProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  const onlineUsers = users.filter(user => user.online)
  const offlineUsers = users.filter(user => !user.online)

  return (
    <div className="p-4 h-full overflow-y-auto" style={{ backgroundColor: '#2b56b4' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white mb-2">
          Online ({onlineUsers.length})
        </h3>
        
        <div className="space-y-2">
          {onlineUsers.map(user => (
            <div key={user.id} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`text-white text-xs ${getAvatarColor(user.displayName)}`}>
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-green-300">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {offlineUsers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">
            Offline ({offlineUsers.length})
          </h3>
          
          <div className="space-y-2">
            {offlineUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8 opacity-60">
                    <AvatarFallback className={`text-white text-xs ${getAvatarColor(user.displayName)}`}>
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gray-400 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-white/50">
                    {formatLastSeen(user.lastSeen)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center text-white/70 mt-8">
          <p className="text-sm">No users in this room yet</p>
        </div>
      )}
    </div>
  )
}