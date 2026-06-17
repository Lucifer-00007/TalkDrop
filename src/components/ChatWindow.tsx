'use client'

import { useEffect } from 'react'
import RoomHeader from './RoomHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PresenceList from './PresenceList'
import ChatSkeleton from './ChatSkeleton'
import { useAuth } from '@/hooks/useAuth'
import { useRoom } from '@/hooks/useRoom'

export default function ChatWindow({ roomId }: { roomId: string }) {
  const { isAuthenticated, signIn } = useAuth()
  const { messages, users, typingUsers, loading, sendMessage, handleTyping, currentUser } = useRoom(roomId)

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        const savedDisplayName = localStorage.getItem('displayName')
        if (savedDisplayName) {
          try {
            await signIn(savedDisplayName)
          } catch (error) {
            console.error('Authentication failed:', error)
          }
        }
      }
    }

    initAuth()
  }, [isAuthenticated, signIn])

  if (loading || !isAuthenticated || !currentUser) {
    return <ChatSkeleton />
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <RoomHeader roomId={roomId} users={users} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Presence sidebar - hidden on mobile */}
        <div className="hidden lg:block w-64 shrink-0">
          <PresenceList users={users} />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <div className="flex-1 overflow-hidden pb-20 bg-white dark:bg-gray-800">
            <MessageList 
              messages={messages} 
              currentUserId={currentUser.id}
              typingUsers={typingUsers}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <MessageInput 
              onSendMessage={sendMessage}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>
    </div>
  )
}