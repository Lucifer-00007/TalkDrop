import { Suspense } from 'react'
import RoomSearchPageClient from '@/components/RoomSearchPageClient'

function RoomPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading room...</p>
      </div>
    </div>
  )
}

export default function RoomPage() {
  return (
    <Suspense fallback={<RoomPageFallback />}>
      <RoomSearchPageClient />
    </Suspense>
  )
}
