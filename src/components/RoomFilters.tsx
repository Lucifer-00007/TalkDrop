'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, X } from 'lucide-react'
import { RoomFilters as RoomFiltersType } from '@/lib/admin-rooms'

interface RoomFiltersProps {
  filters: RoomFiltersType
  onFiltersChange: (filters: RoomFiltersType) => void
  totalCount: number
  filteredCount: number
}

export function RoomFilters({ filters, onFiltersChange, totalCount, filteredCount }: RoomFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleStatusChange = (status: 'all' | 'active' | 'disabled') => {
    onFiltersChange({ ...filters, status })
  }

  const handleRoomTypeChange = (roomType: 'all' | 'default' | 'private') => {
    onFiltersChange({ ...filters, roomType })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
    setShowAdvanced(false)
  }

  const hasActiveFilters = filters.search || 
    (filters.status && filters.status !== 'all') ||
    (filters.roomType && filters.roomType !== 'all') ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minUsers !== undefined ||
    filters.maxUsers !== undefined ||
    filters.minMessages !== undefined ||
    filters.maxMessages !== undefined

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room name, ID, or user..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.roomType || 'all'}
          onValueChange={(value) => handleRoomTypeChange(value as 'all' | 'default' | 'private')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="default">Default Rooms</SelectItem>
            <SelectItem value="private">Private Rooms</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => handleStatusChange(value as 'all' | 'active' | 'disabled')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="default"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="default"
            onClick={handleClearFilters}
            className="gap-2 border-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showAdvanced && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    dateTo: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Min Users</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Minimum users"
                  value={filters.minUsers ?? ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    minUsers: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Users</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Maximum users"
                  value={filters.maxUsers ?? ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    maxUsers: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Min Messages</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Minimum messages"
                  value={filters.minMessages ?? ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    minMessages: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Messages</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Maximum messages"
                  value={filters.maxMessages ?? ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    maxMessages: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasActiveFilters && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} rooms
        </p>
      )}
    </div>
  )
}
