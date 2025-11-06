export async function generateStaticParams() {
  return []
}

export const dynamic = 'force-static'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return children
}
