'use client'

import { useRouter } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'
import { Button } from '@/components/ui/button'

interface RoomPageClientProps {
  roomId: string
}

export default function RoomPageClient({ roomId }: RoomPageClientProps) {
  const router = useRouter()

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Room ID required</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Open a valid invite link or go back home to create or join a room.
          </p>
          <Button className="mt-4 w-full" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return <ChatWindow roomId={roomId} />
}
