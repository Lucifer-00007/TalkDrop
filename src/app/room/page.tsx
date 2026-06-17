import { Suspense } from 'react'
import RoomSearchPageClient from '@/components/RoomSearchPageClient'
import ChatSkeleton from '@/components/ChatSkeleton'

export default function RoomPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <RoomSearchPageClient />
    </Suspense>
  )
}
