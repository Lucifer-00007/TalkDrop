import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { firestore } from './firebase'

export interface FirestoreMessage {
  senderId: string
  senderName: string
  text: string
  createdAt: Timestamp | null
  expiresAt: Date
}

export interface RoomMetadata {
  name: string
  createdAt: Timestamp | null
  createdBy: string
}

export const createRoomMetadata = async (roomId: string, metadata: Omit<RoomMetadata, 'createdAt'>) => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')
  const roomRef = doc(firestoreInstance, 'rooms', roomId)
  const existingRoom = await getDoc(roomRef)

  if (existingRoom.exists()) {
    return
  }

  await setDoc(roomRef, {
    ...metadata,
    createdAt: serverTimestamp(),
  })
}

export const saveMessageToFirestore = async (roomId: string, message: Omit<FirestoreMessage, 'createdAt' | 'expiresAt'>) => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')
  const messagesRef = collection(firestoreInstance, 'rooms', roomId, 'messages')
  const expirationTime = new Date()
  expirationTime.setHours(expirationTime.getHours() + 24) // 24 hour retention

  await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp(),
    expiresAt: expirationTime,
  })
}
