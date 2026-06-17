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
    <div className={`flex items-start gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 pt-0.5">
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
      <div className={`flex flex-col max-w-[75%] sm:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 px-1">
            {message.senderName}
          </span>
        )}
        
        <div
          className={`px-3.5 py-2 rounded-2xl break-words transition-shadow ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-md shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
          <p className={`text-[10px] mt-1 text-right ${
            isOwn 
              ? 'text-blue-200' 
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}