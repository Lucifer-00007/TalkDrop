'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'
import ChatSkeleton from '@/components/ChatSkeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { validateRoomForJoin, isPermanentRoom } from '@/lib/firestore'
import { checkRoomHasOnlineUsers } from '@/lib/rtdb'
import { MessageCircle, AlertCircle, Loader2 } from 'lucide-react'

type ViewState = 'loading' | 'error' | 'join-form' | 'chat'

interface RoomPageClientProps {
  roomId: string
}

export default function RoomPageClient({ roomId }: RoomPageClientProps) {
  const router = useRouter()
  const { isAuthenticated, signIn, loading: authLoading } = useAuth()
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!roomId) {
      setViewState('error')
      setErrorMessage('Room ID required. Open a valid invite link or go back home to create or join a room.')
      return
    }

    if (authLoading) return

    const validateAndRoute = async () => {
      if (isAuthenticated) {
        const savedDisplayName = localStorage.getItem('displayName')
        if (savedDisplayName) {
          setViewState('chat')
          return
        }
      }

      try {
        const validation = await validateRoomForJoin(roomId)
        if (!validation.valid) {
          setViewState('error')
          setErrorMessage(validation.error)
          return
        }

        const hasUsers = await checkRoomHasOnlineUsers(roomId, isPermanentRoom(roomId))
        if (!hasUsers) {
          setViewState('error')
          setErrorMessage('This room has no active participants. The room may have been abandoned or the creator has left.')
          return
        }

        const savedDisplayName = localStorage.getItem('displayName')
        if (savedDisplayName) {
          try {
            await signIn(savedDisplayName)
            setViewState('chat')
          } catch {
            setViewState('join-form')
          }
        } else {
          setViewState('join-form')
        }
      } catch (error) {
        console.error('Room validation failed:', error)
        setViewState('error')
        setErrorMessage('Failed to validate room. Please try again.')
      }
    }

    validateAndRoute()
  }, [roomId, isAuthenticated, authLoading, signIn])

  const handleJoin = async () => {
    if (!displayName.trim()) return
    setJoining(true)
    try {
      await signIn(displayName.trim())
      setViewState('chat')
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setJoining(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && displayName.trim() && !joining) {
      handleJoin()
    }
  }

  if (viewState === 'loading') {
    return <ChatSkeleton />
  }

  if (viewState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Unable to Join Room</CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push('/')}>
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (viewState === 'join-form') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-xl">Join Chat Room</CardTitle>
              <CardDescription className="mt-2">
                You&apos;re joining room: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{roomId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full"
                  autoFocus
                  maxLength={80}
                />
              </div>
              <Button
                onClick={handleJoin}
                className="w-full"
                disabled={!displayName.trim() || joining}
              >
                {joining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Joining...
                  </>
                ) : (
                  'Join Room'
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push('/')}
              >
                Go Back Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <ChatWindow roomId={roomId} />
}
