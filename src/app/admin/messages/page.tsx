'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, RefreshCw, Search, MessageSquare, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getAllMessages, deleteMessage, deleteRoomMessages, type AdminMessage } from '@/lib/admin'
import { getAdminActionErrorMessage, getAdminReadErrorMessage } from '@/lib/admin-errors'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function MessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'time-desc' | 'time-asc' | 'sender' | 'room'>('time-desc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearRoomDialogOpen, setClearRoomDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const data = await getAllMessages()
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessages([])
      setError(getAdminReadErrorMessage(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
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

    setDeleting(true)
    setError(null)

    try {
      await deleteMessage(selectedMessage.roomId, selectedMessage.id)
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id))
      setDeleteDialogOpen(false)
      setSelectedMessage(null)
    } catch (error) {
      console.error('Failed to delete message:', error)
      setError(getAdminActionErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return

    setDeleting(true)
    setError(null)

    try {
      await deleteRoomMessages(selectedRoomId)
      setMessages(prev => prev.filter(m => m.roomId !== selectedRoomId))
      setClearRoomDialogOpen(false)
      setSelectedRoomId(null)
    } catch (error) {
      console.error('Failed to delete room messages:', error)
      setError(getAdminActionErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1.5">Monitor and manage all chat messages</p>
        </div>
        <Button 
          onClick={() => loadMessages(true)} 
          disabled={loading || refreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-muted">
                <MessageSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{filteredMessages.length}</p>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-muted">
                <MessageSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">{new Set(messages.map(m => m.roomId)).size}</p>
                <p className="text-sm text-muted-foreground">Unique Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and sort messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by content, sender, or room ID..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Room ID</TableHead>
                  <TableHead className="w-[15%]">Sender</TableHead>
                  <TableHead className="w-[40%]">Message</TableHead>
                  <TableHead className="w-[15%]">Time</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-8 bg-muted animate-pulse rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          {messages.length === 0 ? 'No messages found' : 'No messages match your filters'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={`${message.roomId}-${message.id}`} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <Badge variant="outline" className="font-mono">
                          {message.roomId.substring(0, 8)}...
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{message.senderName}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{message.text}</p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {message.createdAt?.toDate().toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-2"
                            onClick={() => {
                              setSelectedRoomId(message.roomId)
                              setClearRoomDialogOpen(true)
                            }}
                          >
                            Clear Room
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedMessage(message)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDeleteMessage}
        loading={deleting}
      />

      <ConfirmDialog
        open={clearRoomDialogOpen}
        onOpenChange={setClearRoomDialogOpen}
        title="Clear Room Messages"
        description={`Are you sure you want to delete all messages in room ${selectedRoomId}? This action cannot be undone.`}
        onConfirm={handleDeleteRoom}
        confirmText="Delete All"
        loading={deleting}
      />
    </div>
  )
}
