'use client'

import { LayoutDashboard, MessageSquare, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  activeTab: string
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
]

export default function AdminSidebar({ activeTab }: AdminSidebarProps) {
  const router = useRouter()
  const handleSignOut = async () => {
    const authInstance = auth()
    if (authInstance) {
      await authInstance.signOut()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <div>
            <h2 className="font-semibold text-sm">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">TalkDrop</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start mb-1',
                activeTab === item.id && 'bg-secondary'
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-2 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}