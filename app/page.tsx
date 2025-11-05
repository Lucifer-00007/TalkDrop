'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Users, Zap } from 'lucide-react'

const DUMMY_ROOMS = [
  { id: 'general', name: 'General Chat' },
  { id: 'random', name: 'Random' },
  { id: 'tech', name: 'Tech Talk' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'music', name: 'Music Lovers' },
]

export default function HomePage() {
  const [roomId, setRoomId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const router = useRouter()

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">TalkDrop</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Instant chat rooms for quick conversations
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
            
            <div className="space-y-3">
              <Button 
                onClick={createRoom}
                className="w-full"
                disabled={!displayName.trim()}
              >
                Create New Room
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
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
                    variant="outline"
                    disabled={(!roomId.trim() && !selectedRoom) || !displayName.trim()}
                  >
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Messages are automatically deleted after 24 hours</p>
        </div>
      </div>
    </div>
  )
}