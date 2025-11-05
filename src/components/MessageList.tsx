'use client'

import { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: number
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  typingUsers: string[]
}

export default function MessageList({ messages, currentUserId, typingUsers }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const shouldShowAvatar = (message: Message, index: number) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    return prevMessage.senderId !== message.senderId || 
           (message.createdAt - prevMessage.createdAt) > 300000 // 5 minutes
  }

  const shouldShowTimestamp = (message: Message, index: number) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    return (message.createdAt - prevMessage.createdAt) > 300000 // 5 minutes
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.map((message, index) => (
        <div key={message.id}>
          {shouldShowTimestamp(message, index) && (
            <div className="text-center my-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatTime(message.createdAt)}
              </span>
            </div>
          )}
          <MessageItem
            message={message}
            isOwn={message.senderId === currentUserId}
            showAvatar={shouldShowAvatar(message, index)}
          />
        </div>
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-500">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.length} people are typing...`
            }
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}