'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashboardStats, type DashboardStats } from '@/lib/admin-stats'
import { getAdminReadErrorMessage } from '@/lib/admin-errors'
import { MessageSquare, Users, Activity, TrendingUp, RefreshCw } from 'lucide-react'
import { AdminDashboardSkeleton } from '@/components/AdminSkeletons'

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isFirstLoad = useRef(true)

  const loadStats = useCallback(async () => {
    if (isFirstLoad.current) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    setError(null)

    try {
      console.log('[Admin Page] Loading dashboard stats...')
      const data = await getDashboardStats()
      console.log('[Admin Page] Stats loaded:', data)
      setStats(data)
    } catch (error) {
      console.error('[Admin Page] Failed to load stats:', error)
      setStats(null)
      setError(getAdminReadErrorMessage(error))
    } finally {
      isFirstLoad.current = false
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [loadStats])

  if (loading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <p className="text-muted-foreground mt-1">Real-time overview of your TalkDrop instance</p>
      </div>

      {error && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={loadStats}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRooms || 0}</div>
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {stats?.activeRooms || 0} active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messagesLast24h || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Messages sent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Firebase Realtime Database</span>
            <Badge variant="default">Connected</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Firebase Firestore</span>
            <Badge variant="default">Connected</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Message Retention</span>
            <Badge variant="secondary">24 hours</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
