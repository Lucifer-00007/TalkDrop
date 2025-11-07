'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: number
}

interface MessageItemProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export default function MessageItem({ message, isOwn, showAvatar }: MessageItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
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

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`text-white text-xs ${getAvatarColor(message.senderName)}`}>
              {getInitials(message.senderName)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 px-1">
            {message.senderName}
          </span>
        )}
        
        <div
          className={`px-3 py-2 rounded-lg break-words ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <p className={`text-xs mt-1 text-right ${
            isOwn 
              ? 'text-blue-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}