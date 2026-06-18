'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminRoomData } from '@/lib/admin-rooms'

interface EditRoomDialogProps {
  room: AdminRoomData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (roomId: string, name: string) => Promise<void>
}

export function EditRoomDialog({ room, open, onOpenChange, onSave }: EditRoomDialogProps) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (room) {
      setName(room.name)
    }
  }, [room])

  const handleSave = async () => {
    if (!room || !name.trim()) return

    setSaving(true)
    try {
      await onSave(room.id, name.trim())
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving room:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="room-id">Room ID</Label>
            <Input
              id="room-id"
              value={room.id}
              disabled
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-name">Room Name</Label>
            <Input
              id="room-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter room name"
              disabled={saving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
