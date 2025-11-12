import RoomPageClient from '@/components/RoomPageClient'
import { DUMMY_ROOMS } from '@/constants'

export const dynamicParams = false

export async function generateStaticParams() {
  return DUMMY_ROOMS.map(room => ({ id: room.id }))
}

export default function RoomPage() {
  return <RoomPageClient />
}