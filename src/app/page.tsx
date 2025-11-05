'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Users, Zap } from 'lucide-react'
import Header from '@/components/Header'
import { DUMMY_ROOMS, APP_NAME, APP_TAGLINE, HOW_IT_WORKS, USE_CASES, MESSAGE_RETENTION, COPYRIGHT_YEAR } from '@/constants'

export default function HomePage() {
  const [roomId, setRoomId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [roomName, setRoomName] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const router = useRouter()

  const createRoom = () => {
    const newRoomId = roomName.trim() || Math.random().toString(36).substring(2, 8)
    if (displayName.trim()) {
      localStorage.setItem('displayName', displayName.trim())
      router.push(`/room/${newRoomId}`)
    }
  }

  const joinRoom = () => {
    const targetRoom = selectedRoom || roomId.trim()
    if (targetRoom && displayName.trim()) {
      localStorage.setItem('displayName', displayName.trim())
      router.push(`/room/${targetRoom}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{APP_NAME}</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {APP_TAGLINE}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Instant Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create or join rooms in seconds. No registration required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Messages appear instantly with typing indicators and presence.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
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
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Enter your display name to create or join a room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={mode === 'create' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setMode('create')}
              >
                Create New
              </Button>
              <Button
                variant={mode === 'join' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setMode('join')}
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
                  disabled={!displayName.trim()}
                >
                  Create New Room
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
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
                    onClick={joinRoom}
                    disabled={!selectedRoom || !displayName.trim()}
                  >
                    Join
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
                    disabled={(!roomId.trim() && !selectedRoom) || !displayName.trim()}
                  >
                    Join
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {USE_CASES.map((useCase) => (
              <Card key={useCase.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pb-8 text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">Messages are automatically deleted after {MESSAGE_RETENTION}</p>
          <p>© {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
      </div>
    </div>
  )
}