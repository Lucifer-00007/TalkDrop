import RoomPageClient from '@/components/RoomPageClient'

export async function generateStaticParams() {
  return [
    { id: 'general' },
    { id: 'random' },
  ]
}

export default function RoomPage() {
  return <RoomPageClient />
}