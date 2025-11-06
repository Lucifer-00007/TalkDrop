'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RoomHeader from './RoomHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PresenceList from './PresenceList'
import { MOCK_MESSAGES, MOCK_USERS } from '@/constants'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: number
}

interface User {
  id: string
  displayName: string
  online: boolean
  lastSeen: number
}

export default function ChatWindow({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Get display name from localStorage or redirect to home
    const displayName = localStorage.getItem('displayName')
    if (!displayName) {
      router.push('/')
      return
    }

    // Create current user
    const userId = Math.random().toString(36).substring(2, 15)
    const user: User = {
      id: userId,
      displayName,
      online: true,
      lastSeen: Date.now()
    }
    setCurrentUser(user)

    // Mock data for development
    setMessages([
      ...MOCK_MESSAGES.map(msg => ({
        ...msg,
        createdAt: Date.now() - msg.timeOffset
      })),
      {
        id: '3',
        senderId: user.id,
        senderName: user.displayName,
        text: 'Just joined the room!',
        createdAt: Date.now() - 120000
      }
    ])

    setUsers([
      ...MOCK_USERS.map(u => ({
        ...u,
        lastSeen: Date.now() - u.lastSeenOffset
      })),
      user
    ])
  }, [roomId, router])

  const sendMessage = (text: string) => {
    if (!currentUser || !text.trim()) return

    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text: text.trim(),
      createdAt: Date.now()
    }

    setMessages(prev => [...prev, newMessage])
  }

  const handleTyping = (isTyping: boolean) => {
    if (!currentUser) return
    
    if (isTyping) {
      setTypingUsers(prev => 
        prev.includes(currentUser.displayName) 
          ? prev 
          : [...prev, currentUser.displayName]
      )
    } else {
      setTypingUsers(prev => 
        prev.filter(name => name !== currentUser.displayName)
      )
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <RoomHeader roomId={roomId} />
      
      <div className="flex-1 flex">
        {/* Presence sidebar - hidden on mobile */}
        <div className="hidden lg:block w-64">
          <PresenceList users={users} />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <MessageList 
            messages={messages} 
            currentUserId={currentUser.id}
            typingUsers={typingUsers}
          />
          <MessageInput 
            onSendMessage={sendMessage}
            onTyping={handleTyping}
          />
        </div>
      </div>
    </div>
  )
}