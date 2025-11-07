'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import RoomHeader from './RoomHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PresenceList from './PresenceList'
import { useAuth } from '@/hooks/useAuth'
import { useRoom } from '@/hooks/useRoom'

export default function ChatWindow({ roomId }: { roomId: string }) {
  const router = useRouter()
  const { isAuthenticated, signIn } = useAuth()
  const { messages, users, typingUsers, loading, sendMessage, handleTyping, currentUser } = useRoom(roomId)

  useEffect(() => {
    const initAuth = async () => {
      const savedDisplayName = localStorage.getItem('displayName')
      if (!savedDisplayName) {
        router.push('/')
        return
      }
      
      if (!isAuthenticated) {
        try {
          await signIn(savedDisplayName)
        } catch (error) {
          console.error('Authentication failed:', error)
          router.push('/')
        }
      }
    }

    initAuth()
  }, [isAuthenticated, router, signIn])

  if (loading || !isAuthenticated || !currentUser) {
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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <RoomHeader roomId={roomId} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Presence sidebar - hidden on mobile */}
        <div className="hidden lg:block w-64">
          <PresenceList users={users} />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-hidden pb-28 bg-white dark:bg-gray-800">
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