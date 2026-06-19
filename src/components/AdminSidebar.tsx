'use client'

import { LayoutDashboard, MessageSquare, Settings, User, LogOut, Users, DoorOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AdminSidebarProps {
  activeTab: string
}

const mainMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'rooms', label: 'Rooms', icon: DoorOpen, href: '/admin/rooms' },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
]

const bottomMenuItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  { id: 'profile', label: 'Profile', icon: User, href: '/admin/profile' },
]

export default function AdminSidebar({ activeTab }: AdminSidebarProps) {
  const router = useRouter()
  const handleSignOut = async () => {
    const authInstance = auth()
    if (authInstance) {
      await authInstance.signOut()
      router.push('/')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            T
          </div>
          <div>
            <h2 className="font-bold text-base">TalkDrop</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="space-y-1">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-10 px-3 transition-all',
                  isActive && 'bg-primary/10 text-primary font-medium shadow-sm'
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className={cn('h-4 w-4 mr-3', isActive && 'text-primary')} />
                {item.label}
              </Button>
            )
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-10 px-3 transition-all',
                  isActive && 'bg-primary/10 text-primary font-medium shadow-sm'
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className={cn('h-4 w-4 mr-3', isActive && 'text-primary')} />
                {item.label}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t bg-muted/30">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-10 px-3 text-destructive hover:text-destructive hover:bg-destructive/10" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}