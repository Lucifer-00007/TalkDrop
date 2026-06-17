import AdminRouteGuard from '@/components/AdminRouteGuard'

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>
}
