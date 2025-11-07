import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { 
  sendMessageToRTDB, 
  listenToMessages, 
  setPresence, 
  listenToPresence, 
  setTyping, 
  listenToTyping,
  RTDBMessage,
  RTDBPresence 
} from '@/lib/rtdb'
import { saveMessageToFirestore, createRoomMetadata } from '@/lib/firestore'

export interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: number
}

export interface User {
  id: string
  displayName: string
  online: boolean
  lastSeen: number
}

export const useRoom = (roomId: string) => {
  const { user, displayName, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Convert RTDB messages to local format
  const convertRTDBMessage = (rtdbMsg: RTDBMessage): Message => ({
    id: rtdbMsg.id,
    senderId: rtdbMsg.senderId,
    senderName: rtdbMsg.senderName,
    text: rtdbMsg.text,
    createdAt: rtdbMsg.timestamp
  })

  // Convert presence data to users array
  const convertPresenceToUsers = (presence: Record<string, RTDBPresence>): User[] => {
    return Object.entries(presence).map(([userId, data]) => ({
      id: userId,
      displayName: data.displayName,
      online: data.online,
      lastSeen: data.lastSeen
    }))
  }

  // Set up room listeners
  useEffect(() => {
    if (!isAuthenticated || !user || !displayName) return

    let unsubscribeMessages: (() => void) | undefined
    let unsubscribePresence: (() => void) | undefined
    let unsubscribeTyping: (() => void) | undefined

    const setupRoom = async () => {
      try {
        // Create room metadata if it doesn't exist
        await createRoomMetadata(roomId, {
          name: roomId,
          createdBy: user.uid
        })

        // Set user presence
        await setPresence(roomId, user.uid, {
          displayName,
          online: true,
          lastSeen: Date.now()
        })

        // Listen to messages
        unsubscribeMessages = listenToMessages(roomId, (rtdbMessages) => {
          const convertedMessages = rtdbMessages.map(convertRTDBMessage)
          setMessages(convertedMessages)
        })

        // Listen to presence
        unsubscribePresence = listenToPresence(roomId, (presence) => {
          const usersList = convertPresenceToUsers(presence)
          setUsers(usersList)
        })

        // Listen to typing indicators
        unsubscribeTyping = listenToTyping(roomId, (typing) => {
          const typingUserIds = Object.entries(typing)
            .filter(([, isTyping]) => isTyping)
            .map(([userId]) => userId)
          
          setTypingUsers(typingUserIds.filter(id => id !== user?.uid))
        })

        setLoading(false)
      } catch (error) {
        console.error('Failed to setup room:', error)
        setLoading(false)
      }
    }

    setupRoom()

    return () => {
      unsubscribeMessages?.()
      unsubscribePresence?.()
      unsubscribeTyping?.()
    }
  }, [roomId, user, displayName, isAuthenticated])

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !displayName || !text.trim()) return

    const messageData = {
      senderId: user.uid,
      senderName: displayName,
      text: text.trim()
    }

    try {
      // Dual write: RTDB for real-time, Firestore for persistence
      await Promise.all([
        sendMessageToRTDB(roomId, messageData),
        saveMessageToFirestore(roomId, messageData)
      ])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [roomId, user, displayName])

  const handleTyping = useCallback(async (isTyping: boolean) => {
    if (!user) return
    
    try {
      await setTyping(roomId, user.uid, isTyping)
    } catch (error) {
      console.error('Failed to set typing status:', error)
    }
  }, [roomId, user])

  return {
    messages,
    users,
    typingUsers,
    loading,
    sendMessage,
    handleTyping,
    currentUser: user ? {
      id: user.uid,
      displayName,
      online: true,
      lastSeen: Date.now()
    } : null
  }
}