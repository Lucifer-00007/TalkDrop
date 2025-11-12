import { collection, query, orderBy, limit, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { ref, remove } from 'firebase/database'
import { firestore, rtdb } from './firebase'
import type { FirestoreMessage } from './firestore'

export interface AdminMessage extends FirestoreMessage {
  id: string
  roomId: string
}

export const getAllMessages = async (limitCount = 100): Promise<AdminMessage[]> => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')
  
  const roomsRef = collection(firestoreInstance, 'rooms')
  const roomsSnapshot = await getDocs(roomsRef)
  
  const allMessages: AdminMessage[] = []
  
  for (const roomDoc of roomsSnapshot.docs) {
    const messagesRef = collection(firestoreInstance, 'rooms', roomDoc.id, 'messages')
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const messagesSnapshot = await getDocs(messagesQuery)
    
    messagesSnapshot.docs.forEach(messageDoc => {
      allMessages.push({
        id: messageDoc.id,
        roomId: roomDoc.id,
        ...messageDoc.data() as FirestoreMessage
      })
    })
  }
  
  return allMessages.sort((a, b) => 
    (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
  )
}

export const deleteMessage = async (roomId: string, messageId: string) => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (firestoreInstance) {
    const messageRef = doc(firestoreInstance, 'rooms', roomId, 'messages', messageId)
    await deleteDoc(messageRef)
  }
  
  if (rtdbInstance) {
    const rtdbMessageRef = ref(rtdbInstance, `rooms/${roomId}/messages/${messageId}`)
    await remove(rtdbMessageRef)
  }
}

export const deleteRoomMessages = async (roomId: string) => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (firestoreInstance) {
    const messagesRef = collection(firestoreInstance, 'rooms', roomId, 'messages')
    const snapshot = await getDocs(messagesRef)
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
  }
  
  if (rtdbInstance) {
    const rtdbMessagesRef = ref(rtdbInstance, `rooms/${roomId}/messages`)
    await remove(rtdbMessagesRef)
  }
}