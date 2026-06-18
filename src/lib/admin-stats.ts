import { collection, getDocs } from 'firebase/firestore'
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

  const yesterdayMillis = Date.now() - 24 * 60 * 60 * 1000

  const roomsSnapshot = await getDocs(collection(firestoreInstance, 'rooms'))
  const roomIds = roomsSnapshot.docs.map((doc) => doc.id)
  const totalRooms = roomsSnapshot.size

  const [messageStats, presenceStats] = await Promise.all([
    Promise.all(
      roomIds.map(async (roomId) => {
        const messagesSnapshot = await getDocs(
          collection(firestoreInstance, 'rooms', roomId, 'messages')
        )
        const total = messagesSnapshot.size
        let last24h = 0

        for (const doc of messagesSnapshot.docs) {
          const createdAt = doc.get('createdAt')
          if (createdAt) {
            const ts = typeof createdAt === 'object' && 'toMillis' in createdAt
              ? createdAt.toMillis()
              : Number(createdAt)
            if (ts >= yesterdayMillis) last24h++
          }
        }

        return { total, last24h }
      })
    ),
    rtdbInstance
      ? get(ref(rtdbInstance, 'rooms')).then((snapshot) => {
          let activeRooms = 0
          let activeUsers = 0

          if (snapshot.exists()) {
            const roomsData = snapshot.val() as Record<string, { presence?: Record<string, { online?: boolean }> }>
            for (const roomData of Object.values(roomsData)) {
              if (roomData.presence) {
                const onlineCount = Object.values(roomData.presence).filter((p) => p.online).length
                if (onlineCount > 0) {
                  activeRooms++
                  activeUsers += onlineCount
                }
              }
            }
          }

          return { activeRooms, activeUsers }
        })
      : Promise.resolve({ activeRooms: 0, activeUsers: 0 }),
  ])

  const totalMessages = messageStats.reduce((sum, s) => sum + s.total, 0)
  const messagesLast24h = messageStats.reduce((sum, s) => sum + s.last24h, 0)

  return {
    totalRooms,
    activeRooms: presenceStats.activeRooms,
    totalMessages,
    messagesLast24h,
    activeUsers: presenceStats.activeUsers,
  }
}
