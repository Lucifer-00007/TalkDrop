import { ref, remove, get } from 'firebase/database'
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { rtdb, firestore } from './firebase'

export interface DeleteUserResult {
  success: boolean
  deletedPresenceCount: number
  deletedTypingCount: number
  deletedMessagesCount: number
}

/**
 * Delete all user data from the database
 * This includes:
 * - Presence data from all rooms in RTDB
 * - Typing indicators from all rooms in RTDB
 * - Messages sent by the user in Firestore
 */
export const deleteUserData = async (userId: string): Promise<DeleteUserResult> => {
  const rtdbInstance = rtdb()
  const firestoreInstance = firestore()
  
  if (!rtdbInstance) {
    throw new Error('Firebase Realtime Database not initialized')
  }
  if (!firestoreInstance) {
    throw new Error('Firebase Firestore not initialized')
  }

  let deletedPresenceCount = 0
  let deletedTypingCount = 0
  let deletedMessagesCount = 0

  try {
    // 1. Get all rooms from RTDB
    const roomsRef = ref(rtdbInstance, 'rooms')
    const roomsSnapshot = await get(roomsRef)
    const roomsData = roomsSnapshot.val()

    if (roomsData) {
      const deletePromises: Promise<void>[] = []

      // 2. Delete user presence and typing data from all rooms
      Object.keys(roomsData).forEach((roomId) => {
        // Delete presence data
        const presenceRef = ref(rtdbInstance, `rooms/${roomId}/presence/${userId}`)
        deletePromises.push(
          get(presenceRef).then(snapshot => {
            if (snapshot.exists()) {
              deletedPresenceCount++
              return remove(presenceRef)
            }
          })
        )

        // Delete typing indicator data
        const typingRef = ref(rtdbInstance, `rooms/${roomId}/typing/${userId}`)
        deletePromises.push(
          get(typingRef).then(snapshot => {
            if (snapshot.exists()) {
              deletedTypingCount++
              return remove(typingRef)
            }
          })
        )
      })

      await Promise.all(deletePromises)
    }

    // 3. Delete messages from Firestore
    // We need to check all rooms for messages sent by this user
    const roomsCollection = collection(firestoreInstance, 'rooms')
    const roomsQuerySnapshot = await getDocs(roomsCollection)

    const messageDeletePromises: Promise<void>[] = []

    for (const roomDoc of roomsQuerySnapshot.docs) {
      const roomId = roomDoc.id
      const messagesRef = collection(firestoreInstance, 'rooms', roomId, 'messages')
      
      // Query messages where senderId matches the user
      const messagesQuery = query(messagesRef, where('senderId', '==', userId))
      const messagesSnapshot = await getDocs(messagesQuery)
      
      messagesSnapshot.docs.forEach((messageDoc) => {
        deletedMessagesCount++
        messageDeletePromises.push(deleteDoc(messageDoc.ref))
      })
    }

    await Promise.all(messageDeletePromises)

    return {
      success: true,
      deletedPresenceCount,
      deletedTypingCount,
      deletedMessagesCount,
    }
  } catch (error) {
    console.error('Error deleting user data:', error)
    throw error
  }
}

/**
 * Check if a user exists in any room
 */
export const userExists = async (userId: string): Promise<boolean> => {
  const rtdbInstance = rtdb()
  if (!rtdbInstance) return false

  try {
    const roomsRef = ref(rtdbInstance, 'rooms')
    const roomsSnapshot = await get(roomsRef)
    const roomsData = roomsSnapshot.val()

    if (!roomsData) return false

    // Check if user exists in any room's presence data
    for (const roomData of Object.values(roomsData as Record<string, Record<string, unknown>>)) {
      if (roomData.presence && typeof roomData.presence === 'object') {
        const presenceData = roomData.presence as Record<string, unknown>
        if (presenceData[userId]) {
          return true
        }
      }
    }

    return false
  } catch (error) {
    console.error('Error checking user existence:', error)
    return false
  }
}
