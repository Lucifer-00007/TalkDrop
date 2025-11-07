import { ref, push, set, onValue, off, serverTimestamp, onDisconnect } from 'firebase/database'
import { rtdb } from './firebase'

export interface RTDBMessage {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
}

export interface RTDBPresence {
  displayName: string
  online: boolean
  lastSeen: number
}

export const sendMessageToRTDB = async (roomId: string, message: Omit<RTDBMessage, 'id' | 'timestamp'>) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) throw new Error('Firebase RTDB not initialized')
  const messagesRef = ref(rtdbInstance, `rooms/${roomId}/messages`)
  const newMessageRef = push(messagesRef)
  await set(newMessageRef, {
    ...message,
    id: newMessageRef.key,
    timestamp: serverTimestamp()
  })
  return newMessageRef.key
}

export const listenToMessages = (roomId: string, callback: (messages: RTDBMessage[]) => void) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) return () => {}
  const messagesRef = ref(rtdbInstance, `rooms/${roomId}/messages`)
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const messages = Object.values(data) as RTDBMessage[]
      messages.sort((a, b) => a.timestamp - b.timestamp)
      callback(messages)
    } else {
      callback([])
    }
  })
  return () => off(messagesRef, 'value', unsubscribe)
}

export const setPresence = async (roomId: string, userId: string, presence: RTDBPresence) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) throw new Error('Firebase RTDB not initialized')
  const presenceRef = ref(rtdbInstance, `rooms/${roomId}/presence/${userId}`)
  await set(presenceRef, presence)
  
  // Set up disconnect handler
  const disconnectRef = onDisconnect(presenceRef)
  await disconnectRef.set({
    ...presence,
    online: false,
    lastSeen: serverTimestamp()
  })
}

export const listenToPresence = (roomId: string, callback: (users: Record<string, RTDBPresence>) => void) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) return () => {}
  const presenceRef = ref(rtdbInstance, `rooms/${roomId}/presence`)
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const data = snapshot.val() || {}
    callback(data)
  })
  return () => off(presenceRef, 'value', unsubscribe)
}

export const setTyping = async (roomId: string, userId: string, isTyping: boolean) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) throw new Error('Firebase RTDB not initialized')
  const typingRef = ref(rtdbInstance, `rooms/${roomId}/typing/${userId}`)
  if (isTyping) {
    await set(typingRef, true)
    // Auto-clear typing after 3 seconds
    setTimeout(() => set(typingRef, false), 3000)
  } else {
    await set(typingRef, false)
  }
}

export const listenToTyping = (roomId: string, callback: (typing: Record<string, boolean>) => void) => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) return () => {}
  const typingRef = ref(rtdbInstance, `rooms/${roomId}/typing`)
  const unsubscribe = onValue(typingRef, (snapshot) => {
    const data = snapshot.val() || {}
    callback(data)
  })
  return () => off(typingRef, 'value', unsubscribe)
}