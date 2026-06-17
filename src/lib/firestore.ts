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
import { DUMMY_ROOMS } from '@/constants'

export const ROOM_EXPIRY_HOURS = 24

const PERMANENT_ROOM_IDS = new Set(DUMMY_ROOMS.map((r) => r.id))

export const isPermanentRoom = (roomId: string) => PERMANENT_ROOM_IDS.has(roomId)

export type RoomValidationResult =
  | { valid: true }
  | { valid: false; error: string }

export const validateRoomForJoin = async (roomId: string): Promise<RoomValidationResult> => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) {
    return { valid: false, error: 'Firebase not initialized. Please check your configuration.' }
  }

  // Permanent rooms bypass existence and expiry validation
  if (PERMANENT_ROOM_IDS.has(roomId)) {
    return { valid: true }
  }

  try {
    const roomRef = doc(firestoreInstance, 'rooms', roomId)
    const roomSnap = await getDoc(roomRef)

    if (!roomSnap.exists()) {
      return { valid: false, error: 'Room not found. This room does not exist or has been deleted.' }
    }

    const data = roomSnap.data() as RoomMetadata
    const now = new Date()

    if (data.createdAt) {
      const createdAt = data.createdAt.toDate()
      const expiresAt = new Date(createdAt.getTime() + ROOM_EXPIRY_HOURS * 60 * 60 * 1000)
      if (now > expiresAt) {
        return { valid: false, error: 'This room has expired. Rooms are active for 24 hours after creation.' }
      }
    }

    return { valid: true }
  } catch (error) {
    console.error('Error validating room:', error)
    return { valid: false, error: 'Failed to validate room. Please try again.' }
  }
}

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

  try {
    await setDoc(roomRef, {
      ...metadata,
      createdAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    const firebaseError = error as { code?: string }
    // If it's a permission-denied error, it likely means the room already exists and we can't overwrite it, which is expected.
    if (firebaseError?.code !== 'permission-denied') {
      console.error('Error creating room metadata:', error)
    }
  }
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
