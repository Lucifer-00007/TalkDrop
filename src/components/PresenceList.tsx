'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users as UsersIcon, Circle } from 'lucide-react'

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
    <div className="h-full flex flex-col bg-gradient-to-b from-[#2b56b4] to-[#1b48ac] dark:from-gray-900 dark:to-gray-950 border-r border-white/10 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-white/10 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-1">
          <UsersIcon className="h-5 w-5 text-white/90 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-white dark:text-gray-200">Participants</h2>
        </div>
        <p className="text-xs text-white/60 dark:text-gray-400">{users.length} {users.length === 1 ? 'person' : 'people'} in room</p>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 px-2 mb-3">
              <Circle className="h-2 w-2 fill-green-400 text-green-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-white/80 dark:text-gray-300 uppercase tracking-wider">
                Online · {onlineUsers.length}
              </h3>
            </div>
            
            <div className="space-y-1">
              {onlineUsers.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 dark:ring-gray-700 transition-transform group-hover:scale-110">
                      <AvatarFallback className={`text-white text-xs font-semibold ${getAvatarColor(user.displayName)}`}>
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-[#2b56b4] dark:border-gray-900 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white dark:text-gray-200 truncate group-hover:text-white">
                      {user.displayName}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full"></div>
                      <p className="text-xs text-green-300 dark:text-green-400">Active now</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Users */}
        {offlineUsers.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 px-2 mb-3">
              <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
              <h3 className="text-xs font-semibold text-white/60 dark:text-gray-400 uppercase tracking-wider">
                Offline · {offlineUsers.length}
              </h3>
            </div>
            
            <div className="space-y-1">
              {offlineUsers.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 opacity-70 group-hover:opacity-90 transition-all">
                      <AvatarFallback className={`text-white text-xs font-semibold ${getAvatarColor(user.displayName)}`}>
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gray-500 border-2 border-[#2b56b4] dark:border-gray-900 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 dark:text-gray-400 truncate group-hover:text-white/90">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-white/50 dark:text-gray-500">
                      {formatLastSeen(user.lastSeen)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="bg-white/10 dark:bg-gray-800/50 rounded-full p-4 mb-4">
              <UsersIcon className="h-8 w-8 text-white/50 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-white/70 dark:text-gray-400 mb-1">No one here yet</p>
            <p className="text-xs text-white/50 dark:text-gray-500">Share the room link to invite others</p>
          </div>
        )}
      </div>
    </div>
  )
}