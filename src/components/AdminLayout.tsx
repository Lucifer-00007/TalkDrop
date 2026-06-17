'use client'

import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard'
    if (pathname?.startsWith('/admin/users')) return 'users'
    if (pathname?.startsWith('/admin/messages')) return 'messages'
    if (pathname?.startsWith('/admin/settings')) return 'settings'
    if (pathname?.startsWith('/admin/profile')) return 'profile'
    return 'dashboard'
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
