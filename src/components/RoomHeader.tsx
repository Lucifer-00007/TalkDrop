'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Share2, ArrowLeft, Users } from 'lucide-react'

interface RoomHeaderProps {
  roomId: string
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

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
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Room {roomId}
            </h1>
            <p className="text-sm text-gray-500">
              Share this room ID to invite others
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile users indicator */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={copyRoomLink}
            className="hidden sm:flex"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="sm:hidden"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="hidden sm:flex"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </header>
  )
}