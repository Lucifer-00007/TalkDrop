import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, get, remove } from 'firebase/database'
import { firestore, rtdb } from './firebase'
import { RTDBPresence } from './rtdb'
import { RoomMetadata } from './firestore'

export interface RoomUser {
  uid: string
  displayName: string
  online: boolean
  lastSeen: number
}

export interface AdminRoomData {
  id: string
  name: string
  createdAt: Date | null
  createdBy: string
  lastMessageAt: Date | null
  userCount: number
  messageCount: number
  status: 'active' | 'disabled'
  users: RoomUser[]
}

export interface RoomFilters {
  search?: string
  status?: 'all' | 'active' | 'disabled'
  dateFrom?: Date
  dateTo?: Date
  minUsers?: number
  maxUsers?: number
  minMessages?: number
  maxMessages?: number
}

export const getAllRooms = async (): Promise<AdminRoomData[]> => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')

  const roomsSnapshot = await getDocs(collection(firestoreInstance, 'rooms'))
  const rooms: AdminRoomData[] = []

  for (const roomDoc of roomsSnapshot.docs) {
    const roomId = roomDoc.id
    const metadata = roomDoc.data() as RoomMetadata & { status?: 'active' | 'disabled' }
    
    // Get messages count and last message time
    const messagesSnapshot = await getDocs(collection(firestoreInstance, 'rooms', roomId, 'messages'))
    const messageCount = messagesSnapshot.size
    
    let lastMessageAt: Date | null = null
    if (!messagesSnapshot.empty) {
      const timestamps = messagesSnapshot.docs
        .map(doc => doc.get('createdAt'))
        .filter(Boolean)
        .map(ts => (typeof ts === 'object' && 'toMillis' in ts ? ts.toMillis() : Number(ts)))
      
      if (timestamps.length > 0) {
        lastMessageAt = new Date(Math.max(...timestamps))
      }
    }

    // Get presence data from RTDB
    let users: RoomUser[] = []
    if (rtdbInstance) {
      try {
        const presenceRef = ref(rtdbInstance, `rooms/${roomId}/presence`)
        const presenceSnapshot = await get(presenceRef)
        const presenceData = presenceSnapshot.val() as Record<string, RTDBPresence> | null
        
        if (presenceData) {
          users = Object.entries(presenceData).map(([uid, data]) => ({
            uid,
            displayName: data.displayName,
            online: data.online,
            lastSeen: data.lastSeen,
          }))
        }
      } catch (error) {
        console.error(`Error fetching presence for room ${roomId}:`, error)
      }
    }

    rooms.push({
      id: roomId,
      name: metadata.name || roomId,
      createdAt: metadata.createdAt ? metadata.createdAt.toDate() : null,
      createdBy: metadata.createdBy || 'Unknown',
      lastMessageAt,
      userCount: users.length,
      messageCount,
      status: metadata.status || 'active',
      users,
    })
  }

  return rooms
}

export const getRoomDetails = async (roomId: string): Promise<AdminRoomData | null> => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')

  const roomRef = doc(firestoreInstance, 'rooms', roomId)
  const roomDoc = await getDoc(roomRef)
  
  if (!roomDoc.exists()) return null

  const metadata = roomDoc.data() as RoomMetadata & { status?: 'active' | 'disabled' }
  
  // Get messages
  const messagesSnapshot = await getDocs(collection(firestoreInstance, 'rooms', roomId, 'messages'))
  const messageCount = messagesSnapshot.size
  
  let lastMessageAt: Date | null = null
  if (!messagesSnapshot.empty) {
    const timestamps = messagesSnapshot.docs
      .map(doc => doc.get('createdAt'))
      .filter(Boolean)
      .map(ts => (typeof ts === 'object' && 'toMillis' in ts ? ts.toMillis() : Number(ts)))
    
    if (timestamps.length > 0) {
      lastMessageAt = new Date(Math.max(...timestamps))
    }
  }

  // Get presence data
  let users: RoomUser[] = []
  if (rtdbInstance) {
    try {
      const presenceRef = ref(rtdbInstance, `rooms/${roomId}/presence`)
      const presenceSnapshot = await get(presenceRef)
      const presenceData = presenceSnapshot.val() as Record<string, RTDBPresence> | null
      
      if (presenceData) {
        users = Object.entries(presenceData).map(([uid, data]) => ({
          uid,
          displayName: data.displayName,
          online: data.online,
          lastSeen: data.lastSeen,
        }))
      }
    } catch (error) {
      console.error(`Error fetching presence for room ${roomId}:`, error)
    }
  }

  return {
    id: roomId,
    name: metadata.name || roomId,
    createdAt: metadata.createdAt ? metadata.createdAt.toDate() : null,
    createdBy: metadata.createdBy || 'Unknown',
    lastMessageAt,
    userCount: users.length,
    messageCount,
    status: metadata.status || 'active',
    users,
  }
}

export const updateRoomMetadata = async (roomId: string, updates: { name?: string; status?: 'active' | 'disabled' }) => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')

  const roomRef = doc(firestoreInstance, 'rooms', roomId)
  await updateDoc(roomRef, updates)
}

export const deleteRoom = async (roomId: string) => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')

  // Delete all messages from Firestore
  const messagesSnapshot = await getDocs(collection(firestoreInstance, 'rooms', roomId, 'messages'))
  const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref))
  await Promise.all(deletePromises)

  // Delete room metadata from Firestore
  await deleteDoc(doc(firestoreInstance, 'rooms', roomId))

  // Delete RTDB data
  if (rtdbInstance) {
    try {
      const roomRef = ref(rtdbInstance, `rooms/${roomId}`)
      await remove(roomRef)
    } catch (error) {
      console.error(`Error deleting RTDB data for room ${roomId}:`, error)
    }
  }
}

export const toggleRoomStatus = async (roomId: string, currentStatus: 'active' | 'disabled'): Promise<'active' | 'disabled'> => {
  const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
  await updateRoomMetadata(roomId, { status: newStatus })
  return newStatus
}

export const filterRooms = (rooms: AdminRoomData[], filters: RoomFilters): AdminRoomData[] => {
  return rooms.filter(room => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = room.name.toLowerCase().includes(searchLower)
      const matchesId = room.id.toLowerCase().includes(searchLower)
      const matchesUser = room.users.some(user => 
        user.displayName.toLowerCase().includes(searchLower) || 
        user.uid.toLowerCase().includes(searchLower)
      )
      
      if (!matchesName && !matchesId && !matchesUser) return false
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (room.status !== filters.status) return false
    }

    // Date range filter
    if (filters.dateFrom && room.createdAt) {
      if (room.createdAt < filters.dateFrom) return false
    }
    if (filters.dateTo && room.createdAt) {
      if (room.createdAt > filters.dateTo) return false
    }

    // User count filter
    if (filters.minUsers !== undefined && room.userCount < filters.minUsers) return false
    if (filters.maxUsers !== undefined && room.userCount > filters.maxUsers) return false

    // Message count filter
    if (filters.minMessages !== undefined && room.messageCount < filters.minMessages) return false
    if (filters.maxMessages !== undefined && room.messageCount > filters.maxMessages) return false

    return true
  })
}

export const isRoomDisabled = async (roomId: string): Promise<boolean> => {
  const firestoreInstance = firestore()
  if (!firestoreInstance) return false

  try {
    const roomRef = doc(firestoreInstance, 'rooms', roomId)
    const roomDoc = await getDoc(roomRef)
    
    if (!roomDoc.exists()) return false

    const metadata = roomDoc.data() as { status?: 'active' | 'disabled' }
    return metadata.status === 'disabled'
  } catch (error) {
    console.error('Error checking room status:', error)
    return false
  }
}
