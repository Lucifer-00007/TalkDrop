'use client'

import { useAuth } from '@/hooks/useAuth'
import AdminAuth from './AdminAuth'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard'
    if (pathname?.startsWith('/admin/messages')) return 'messages'
    if (pathname?.startsWith('/admin/settings')) return 'settings'
    if (pathname?.startsWith('/admin/profile')) return 'profile'
    return 'dashboard'
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <AdminAuth />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:block w-64 border-r">
        <AdminSidebar activeTab={getActiveTab()} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar activeTab={getActiveTab()} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}