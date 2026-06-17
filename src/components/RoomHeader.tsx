'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Copy, Share2, ArrowLeft, Users, Moon, Sun, LogOut } from 'lucide-react'
import { getRoomUrl } from '@/lib/room-url'
import PresenceList from './PresenceList'
import type { User } from '@/hooks/useRoom'

interface RoomHeaderProps {
  roomId: string
  users: User[]
}

export default function RoomHeader({ roomId, users }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const showTooltip = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setShowTip(true)
  }

  const hideTooltip = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setShowTip(false)
  }

  // On touch devices hover events are unreliable; tap shows the tip and
  // auto-hides after a short delay.
  const handleTipClick = () => {
    showTooltip()
    hideTimerRef.current = setTimeout(() => setShowTip(false), 3000)
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    setIsDark(theme === 'dark')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const copyRoomLink = async () => {
    const url = getRoomUrl(window.location.origin, roomId)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareRoom = async () => {
    const url = getRoomUrl(window.location.origin, roomId)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my TalkDrop room',
          text: 'Join this chat room on TalkDrop',
          url: url,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      copyRoomLink()
    }
  }

  const exitRoom = () => {
    router.push('/')
  }

  return (
    <header className="px-3 py-2.5" style={{ backgroundColor: '#1b48ac' }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="lg:hidden h-9 w-9 shrink-0 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-white leading-tight truncate">
              Room {roomId}
            </h1>
            <p
              className="text-xs text-white/70 leading-tight cursor-help relative"
              onMouseEnter={showTooltip}
              onMouseLeave={hideTooltip}
              onFocus={showTooltip}
              onBlur={hideTooltip}
              onClick={handleTipClick}
              tabIndex={0}
            >
              <span className="block truncate">Share this room ID to invite others</span>
              {showTip && (
                <span
                  role="tooltip"
                  className="absolute left-0 top-full mt-1.5 z-50 w-max max-w-[220px] rounded-md bg-gray-900 px-2 py-1 text-xs font-normal normal-case text-white shadow-lg pointer-events-none"
                >
                  Share this room ID to invite others
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-white hover:bg-white/10"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile users indicator with count and participant list */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden relative h-9 w-9 text-white hover:bg-white/10"
              >
                <Users className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center ring-2 ring-[#1b48ac]">
                  {users.length}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">Participants</SheetTitle>
              <PresenceList users={users} />
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={copyRoomLink}
            className="hidden sm:flex h-9 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="sm:hidden h-9 w-9 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="hidden sm:flex h-9 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exitRoom}
            className="h-9 bg-white/10 border-red-400/30 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
