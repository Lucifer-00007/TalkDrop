'use client'

import { useSearchParams } from 'next/navigation'
import RoomPageClient from '@/components/RoomPageClient'
import { normalizeRoomId, ROOM_ID_QUERY_PARAM } from '@/lib/room-url'

export default function RoomSearchPageClient() {
  const searchParams = useSearchParams()
  const roomId = normalizeRoomId(searchParams.get(ROOM_ID_QUERY_PARAM))

  return <RoomPageClient roomId={roomId} />
}
