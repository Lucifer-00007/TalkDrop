'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trash2, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { getAllMessages, deleteMessage, deleteRoomMessages, type AdminMessage } from '@/lib/admin'
import { useAuth } from '@/hooks/useAuth'
import AdminAuth from './AdminAuth'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('messages')
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)

  const loadMessages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllMessages()
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadMessages()
    }
  }, [user, loadMessages])

  if (!user) {
    return <AdminAuth />
  }

  if (activeTab === 'dashboard') {
    return (
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:block w-64 border-r">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground">Dashboard content coming soon...</p>
          </main>
        </div>
      </div>
    )
  }

  if (activeTab === 'settings') {
    return (
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:block w-64 border-r">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings content coming soon...</p>
          </main>
        </div>
      </div>
    )
  }

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(filter.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(filter.toLowerCase()) ||
    msg.roomId.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return
    
    try {
      await deleteMessage(selectedMessage.roomId, selectedMessage.id)
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id))
      setDeleteDialogOpen(false)
      setSelectedMessage(null)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoomMessages(roomId)
      setMessages(prev => prev.filter(m => m.roomId !== roomId))
    } catch (error) {
      console.error('Failed to delete room messages:', error)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:block w-64 border-r">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button onClick={loadMessages} disabled={loading} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <Card className="p-4 mb-6">
            <Input
              placeholder="Filter messages by content, sender, or room ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-md"
            />
          </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.map((message) => (
              <TableRow key={`${message.roomId}-${message.id}`}>
                <TableCell className="font-mono text-xs">{message.roomId}</TableCell>
                <TableCell>{message.senderName}</TableCell>
                <TableCell className="max-w-xs truncate">{message.text}</TableCell>
                <TableCell className="text-xs">
                  {message.createdAt?.toDate().toLocaleString() || 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedMessage(message)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRoom(message.roomId)}
                    >
                      Clear Room
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMessage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </main>
      </div>
    </div>
  )
}