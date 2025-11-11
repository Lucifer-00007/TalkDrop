import RoomPageClient from '@/components/RoomPageClient'
import { DUMMY_ROOMS, DYNAMIC_PARAMS } from '@/constants'

export const dynamicParams = DYNAMIC_PARAMS

export async function generateStaticParams() {
  return DUMMY_ROOMS.map(room => ({ id: room.id }))
}

export default function RoomPage() {
  return <RoomPageClient />
}