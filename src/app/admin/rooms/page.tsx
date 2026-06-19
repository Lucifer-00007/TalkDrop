'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  getAllRooms, 
  getRoomsLightweight,
  filterRooms, 
  deleteRoom, 
  toggleRoomStatus, 
  updateRoomMetadata,
  AdminRoomData,
  RoomFilters as RoomFiltersType
} from '@/lib/admin-rooms'
import { getAdminActionErrorMessage, getAdminReadErrorMessage } from '@/lib/admin-errors'
import { RoomDetailsDialog } from '@/components/RoomDetailsDialog'
import { EditRoomDialog } from '@/components/EditRoomDialog'
import { RoomFilters } from '@/components/RoomFilters'
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  MessageSquare,
  Users,
  Calendar,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const ITEMS_PER_PAGE = 10

export default function AdminRoomsPage() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<AdminRoomData[]>([])
  const [filteredRooms, setFilteredRooms] = useState<AdminRoomData[]>([])
  const [filters, setFilters] = useState<RoomFiltersType>({})
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedRoom, setSelectedRoom] = useState<AdminRoomData | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<AdminRoomData | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)

  const loadRooms = useCallback(async (isRefresh = false, lightweight = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      // Use lightweight loading for faster initial load, or full loading on explicit refresh
      const data = lightweight && !isRefresh 
        ? await getRoomsLightweight()
        : await getAllRooms()
      
      setRooms(data)
      setFilteredRooms(filterRooms(data, filters))
      
      // If we loaded lightweight data, optionally load full details in background
      if (lightweight && !isRefresh) {
        setLoadingDetails(true)
        setTimeout(async () => {
          try {
            const fullData = await getAllRooms()
            setRooms(fullData)
            setFilteredRooms(filterRooms(fullData, filters))
          } catch (error) {
            console.error('Failed to load full room details:', error)
          } finally {
            setLoadingDetails(false)
          }
        }, 100)
      }
    } catch (error) {
      console.error('Failed to load rooms:', error)
      setError(getAdminReadErrorMessage(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters])

  useEffect(() => {
    loadRooms(false, true) // Use lightweight loading for initial load
  }, [loadRooms])

  useEffect(() => {
    setFilteredRooms(filterRooms(rooms, filters))
    setCurrentPage(1)
  }, [rooms, filters])

  const handleViewDetails = (room: AdminRoomData) => {
    setSelectedRoom(room)
    setDetailsDialogOpen(true)
  }

  const handleEdit = (room: AdminRoomData) => {
    setSelectedRoom(room)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async (roomId: string, name: string) => {
    try {
      await updateRoomMetadata(roomId, { name })
      toast({
        title: 'Room updated',
        description: 'Room name has been updated successfully.',
      })
      await loadRooms(true)
    } catch (error) {
      console.error('Failed to update room:', error)
      toast({
        title: 'Failed to update room',
        description: getAdminActionErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = async (room: AdminRoomData) => {
    try {
      const newStatus = await toggleRoomStatus(room.id, room.status)
      toast({
        title: `Room ${newStatus === 'disabled' ? 'disabled' : 'enabled'}`,
        description: `Room "${room.name}" has been ${newStatus === 'disabled' ? 'disabled' : 'enabled'}.`,
      })
      await loadRooms(true)
    } catch (error) {
      console.error('Failed to toggle room status:', error)
      toast({
        title: 'Failed to update room',
        description: getAdminActionErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const handleDeleteClick = (room: AdminRoomData) => {
    setRoomToDelete(room)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return

    setDeleting(true)
    try {
      await deleteRoom(roomToDelete.id)
      toast({
        title: 'Room deleted',
        description: `Room "${roomToDelete.name}" has been permanently deleted.`,
      })
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
      await loadRooms(true)
    } catch (error) {
      console.error('Failed to delete room:', error)
      toast({
        title: 'Failed to delete room',
        description: getAdminActionErrorMessage(error),
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentRooms = filteredRooms.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  if (loading) {
    return <RoomsPageSkeleton />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Rooms</h1>
            {(refreshing || loadingDetails) && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground mt-1">
            Manage all chat rooms
            {loadingDetails && <span className="ml-2 text-xs">(loading message counts...)</span>}
          </p>
        </div>
        <Button onClick={() => loadRooms(true, false)} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => loadRooms()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <RoomFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={rooms.length}
        filteredCount={filteredRooms.length}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Rooms ({filteredRooms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {currentRooms.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-1">No rooms found</p>
              <p className="text-sm text-muted-foreground">
                {rooms.length === 0 
                  ? 'No chat rooms have been created yet.'
                  : 'Try adjusting your filters to find rooms.'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {currentRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{room.name}</h3>
                          <Badge variant={room.status === 'active' ? 'default' : 'secondary'}>
                            {room.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground font-mono truncate">
                          {room.id}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{room.userCount} users</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{room.messageCount} messages</span>
                          </div>
                          {room.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDistanceToNow(room.createdAt, { addSuffix: true })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(room)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(room)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(room)}>
                          {room.status === 'active' ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(room)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <RoomDetailsDialog
        room={selectedRoom}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <EditRoomDialog
        room={selectedRoom}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the room &quot;{roomToDelete?.name}&quot; and all its data,
              including messages and user presence information. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Room'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function RoomsPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-14 w-14 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-96 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
