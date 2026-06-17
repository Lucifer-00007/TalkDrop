'use client'

import { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'
import { MessageCircle } from 'lucide-react'

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
  }, [messages, typingUsers.length])

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
           (message.createdAt - prevMessage.createdAt) > 300000
  }

  const shouldShowTimestamp = (message: Message, index: number) => {
    if (index === 0) return true
    const prevMessage = messages[index - 1]
    return (message.createdAt - prevMessage.createdAt) > 300000
  }

  return (
    <div className="h-full overflow-y-auto p-4 pb-4 space-y-1 bg-white dark:bg-gray-800">
      {messages.length === 0 && typingUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No messages yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Be the first to say hello!</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div key={message.id}>
          {shouldShowTimestamp(message, index) && (
            <div className="flex items-center justify-center my-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
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
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-3 py-2.5">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
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