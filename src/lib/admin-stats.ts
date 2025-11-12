import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { ref, get } from 'firebase/database'
import { firestore, rtdb } from './firebase'

export interface DashboardStats {
  totalRooms: number
  activeRooms: number
  totalMessages: number
  messagesLast24h: number
  activeUsers: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const firestoreInstance = firestore()
  const rtdbInstance = rtdb()
  
  if (!firestoreInstance) throw new Error('Firebase Firestore not initialized')

  console.log('[Admin Stats] Fetching rooms...')
  const roomsSnapshot = await getDocs(collection(firestoreInstance, 'rooms'))
  console.log('[Admin Stats] Rooms fetched:', roomsSnapshot.size)
  const totalRooms = roomsSnapshot.size

  let totalMessages = 0
  let messagesLast24h = 0
  const yesterday = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))

  for (const roomDoc of roomsSnapshot.docs) {
    console.log('[Admin Stats] Fetching messages for room:', roomDoc.id)
    const messagesSnapshot = await getDocs(
      collection(firestoreInstance, 'rooms', roomDoc.id, 'messages')
    )
    console.log('[Admin Stats] Messages fetched for', roomDoc.id, ':', messagesSnapshot.size)
    totalMessages += messagesSnapshot.size

    const recentMessages = await getDocs(
      query(
        collection(firestoreInstance, 'rooms', roomDoc.id, 'messages'),
        where('createdAt', '>=', yesterday)
      )
    )
    messagesLast24h += recentMessages.size
  }

  let activeRooms = 0
  let activeUsers = 0

  if (rtdbInstance) {
    for (const roomDoc of roomsSnapshot.docs) {
      const presenceSnapshot = await get(ref(rtdbInstance, `rooms/${roomDoc.id}/presence`))
      if (presenceSnapshot.exists()) {
        const presenceData = presenceSnapshot.val()
        const onlineUsers = Object.values(presenceData as Record<string, { online?: boolean }>).filter(
          (p) => p.online
        ).length
        if (onlineUsers > 0) {
          activeRooms++
          activeUsers += onlineUsers
        }
      }
    }
  }

  return {
    totalRooms,
    activeRooms,
    totalMessages,
    messagesLast24h,
    activeUsers
  }
}
