'use client'

import { useParams } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string

  return <ChatWindow roomId={roomId} />
}