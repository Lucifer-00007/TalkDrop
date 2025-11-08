'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getAllMessages, deleteMessage, deleteRoomMessages, type AdminMessage } from '@/lib/admin'
import AdminLayout from '@/components/AdminLayout'

export default function MessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'time-desc' | 'time-asc' | 'sender' | 'room'>('time-desc')
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
    loadMessages()
  }, [loadMessages])

  const filteredMessages = useMemo(() => {
    const filtered = messages.filter(msg =>
      msg.text.toLowerCase().includes(filter.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(filter.toLowerCase()) ||
      msg.roomId.toLowerCase().includes(filter.toLowerCase())
    )

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time-asc':
          return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
        case 'time-desc':
          return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        case 'sender':
          return a.senderName.localeCompare(b.senderName)
        case 'room':
          return a.roomId.localeCompare(b.roomId)
        default:
          return 0
      }
    })
  }, [messages, filter, sortBy])

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
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button onClick={loadMessages} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Filter messages by content, sender, or room ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-md"
            />
            <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-desc">Newest First</SelectItem>
                <SelectItem value="time-asc">Oldest First</SelectItem>
                <SelectItem value="sender">Sender (A-Z)</SelectItem>
                <SelectItem value="room">Room ID (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                        variant="outline"
                        className="border-red-600 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950 px-2.5 py-1"
                        onClick={() => {
                          setSelectedMessage(message)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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
      </div>
    </AdminLayout>
  )
}