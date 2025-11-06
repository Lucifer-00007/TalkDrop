'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Share2, ArrowLeft, Users, Moon, Sun } from 'lucide-react'

interface RoomHeaderProps {
  roomId: string
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

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
    const url = `${window.location.origin}/room/${roomId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
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
    const url = `${window.location.origin}/room/${roomId}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my TalkDrop room',
          text: 'Join this chat room on TalkDrop',
          url: url,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      copyRoomLink()
    }
  }

  return (
    <header className="px-4 py-3" style={{ backgroundColor: '#1b48ac' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-white">
              Room {roomId}
            </h1>
            <p className="text-sm text-white/80">
              Share this room ID to invite others
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white hover:bg-white/10"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile users indicator */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyRoomLink}
            className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="sm:hidden bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </header>
  )
}