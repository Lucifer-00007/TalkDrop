'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Users, Zap, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { DUMMY_ROOMS, APP_NAME, APP_TAGLINE, HOW_IT_WORKS, USE_CASES } from '@/constants'
import { getRoomPath } from '@/lib/room-url'
import { validateRoomForJoin, createRoomMetadata, isPermanentRoom } from '@/lib/firestore'
import { checkRoomHasOnlineUsers } from '@/lib/rtdb'

export default function HomePage() {
  const [roomId, setRoomId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [roomName, setRoomName] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [loading, setLoading] = useState(false)
  const [joinError, setJoinError] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()

  const createRoom = async () => {
    const newRoomId = roomName.trim() || Math.random().toString(36).substring(2, 8)
    if (displayName.trim()) {
      setLoading(true)
      setJoinError('')
      try {
        const user = await signIn(displayName.trim())
        await createRoomMetadata(newRoomId, { name: newRoomId, createdBy: user.uid })
        router.push(getRoomPath(newRoomId))
      } catch (error) {
        console.error('Failed to create room:', error)
        setJoinError('Failed to create room. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const joinRoom = async () => {
    const targetRoom = selectedRoom || roomId.trim()
    if (targetRoom && displayName.trim()) {
      setLoading(true)
      setJoinError('')
      try {
        const validation = await validateRoomForJoin(targetRoom)
        if (!validation.valid) {
          setJoinError(validation.error)
          return
        }

        const hasUsers = await checkRoomHasOnlineUsers(targetRoom, isPermanentRoom(targetRoom))
        if (!hasUsers) {
          setJoinError('This room has no active participants. The room may have been abandoned.')
          return
        }

        await signIn(displayName.trim())
        router.push(getRoomPath(targetRoom))
      } catch (error) {
        console.error('Failed to join room:', error)
        setJoinError('Failed to join room. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16 mt-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">No sign-up required</span>
            </div>
            <div className="flex items-center justify-center mb-5">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mr-4">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{APP_NAME}</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              {APP_TAGLINE}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create a room, share the link, and start chatting instantly
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-blue-100 dark:border-gray-700">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Instant Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Create or join rooms in seconds. No registration required.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-green-100 dark:border-gray-700">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-green-100 dark:bg-green-900/40 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Real-time Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Messages appear instantly with typing indicators and presence.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-purple-100 dark:border-gray-700">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-purple-100 dark:bg-purple-900/40 mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Anonymous & Safe</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Chat anonymously with automatic message cleanup.
                  </CardDescription>
                </CardContent>
              </Card>
          </div>

          {/* Main Action Card */}
          <div className="mb-20">
            <Card className="max-w-md mx-auto overflow-visible shadow-xl border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-center">Get Started</CardTitle>
                <CardDescription className="text-center">
                  Enter your display name to create or join a room
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div>
                  <Input
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-1 p-1 bg-muted rounded-lg border border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    className={`flex-1 transition-all ${mode === 'create' ? 'bg-blue-50 dark:bg-blue-700 text-blue-700 dark:text-white ring-1 ring-blue-200 dark:ring-blue-300 font-medium shadow-sm dark:shadow-[0_0_12px_rgba(59,130,246,0.25)]' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => {
                      setMode('create')
                      setJoinError('')
                    }}
                  >
                    Create New
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex-1 transition-all ${mode === 'join' ? 'bg-blue-50 dark:bg-blue-700 text-blue-700 dark:text-white ring-1 ring-blue-200 dark:ring-blue-300 font-medium shadow-sm dark:shadow-[0_0_12px_rgba(59,130,246,0.25)]' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => {
                      setMode('join')
                      setJoinError('')
                    }}
                  >
                    Join Existing
                  </Button>
                </div>

                {mode === 'create' ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Room name (optional)"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                    <Button
                      onClick={createRoom}
                      className="w-full"
                      disabled={!displayName.trim() || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create New Room'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {joinError && (
                      <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{joinError}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Select value={selectedRoom} onValueChange={(value) => {
                        setSelectedRoom(value)
                        setRoomId('')
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {DUMMY_ROOMS.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => {
                          console.log('Dropdown Join:', { selectedRoom, displayName: displayName.trim() })
                          joinRoom()
                        }}
                        disabled={!selectedRoom || !displayName.trim() || loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Joining...
                          </>
                        ) : (
                          'Join'
                        )}
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Or enter Room ID"
                        value={roomId}
                        onChange={(e) => {
                          setRoomId(e.target.value)
                          setSelectedRoom('')
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={joinRoom}
                        disabled={!roomId.trim() || !displayName.trim() || loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Joining...
                          </>
                        ) : (
                          'Join'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-20 border border-white/50 dark:border-gray-700/50">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {HOW_IT_WORKS.map((item, idx) => (
                <div key={item.step} className="text-center relative">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700" />
                  )}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10">
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Perfect For</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {USE_CASES.map((useCase, idx) => {
                const icons = [Users, MessageCircle, Zap, MessageCircle]
                const colors = [
                  'from-blue-500 to-indigo-600',
                  'from-green-500 to-teal-600',
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600'
                ]
                const Icon = icons[idx % icons.length]
                return (
                  <Card key={useCase.title} className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${colors[idx % colors.length]} shadow-md shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{useCase.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Footer */}
        </div>
      </div>
      <Footer />
    </div>
  )
}
