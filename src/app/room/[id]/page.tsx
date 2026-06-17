import RoomPageClient from '@/components/RoomPageClient'
import { DUMMY_ROOMS } from '@/constants'

export const dynamicParams = false

export async function generateStaticParams() {
  return DUMMY_ROOMS.map(room => ({ id: room.id }))
}

type LegacyRoomPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function LegacyRoomPage({ params }: LegacyRoomPageProps) {
  const { id } = await params

  return <RoomPageClient roomId={id} />
}
