import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

interface AnalyticsEvent {
  id: string
  event_type: string
  stream_id: string
  user_id: string
  session_id: string
  timestamp: string
  metadata: any
  created_at: string
}

interface StreamInfo {
  id: string
  title: string
  slug: string
  created_at: string
}

interface ViewerCount {
  timestamp: string
  count: number
}

const AnalyticsPage: React.FC = () => {
  const router = useRouter()
  const { slug } = router.query
  
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [viewerCounts, setViewerCounts] = useState<ViewerCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h')

  // Get time range in hours
  const getTimeRangeHours = (range: string) => {
    switch (range) {
      case '1h': return 1
      case '6h': return 6
      case '24h': return 24
      case '7d': return 24 * 7
      default: return 24
    }
  }

  // Fetch stream info and analytics
  useEffect(() => {
    if (!slug) return

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First, get stream info by slug
        const { data: streamData, error: streamError } = await supabase
          .from('streams')
          .select('*')
          .eq('slug', slug)
          .single()

        if (streamError || !streamData) {
          setError('Stream not found')
          return
        }

        setStreamInfo(streamData)

        // Calculate time range
        const hoursBack = getTimeRangeHours(timeRange)
        const startTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString()

        // Fetch analytics events
        const { data: eventsData, error: eventsError } = await supabase
          .from('analytics_events')
          .select('*')
          .eq('stream_id', streamData.id)
          .gte('created_at', startTime)
          .order('created_at', { ascending: true })

        if (eventsError) {
          console.error('Error fetching events:', eventsError)
          return
        }

        setEvents(eventsData || [])

        // Process viewer counts
        const viewerCounts = processViewerCounts(eventsData || [])
        setViewerCounts(viewerCounts)

      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [slug, timeRange])

  // Process events to get viewer counts over time
  const processViewerCounts = (events: AnalyticsEvent[]): ViewerCount[] => {
    const sessionCounts = new Map<string, Set<string>>()
    const timePoints: { [key: string]: number } = {}

    // Group events by time intervals (5-minute buckets)
    events.forEach(event => {
      const eventTime = new Date(event.timestamp)
      const bucketTime = new Date(
        Math.floor(eventTime.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000)
      ).toISOString()

      if (!sessionCounts.has(bucketTime)) {
        sessionCounts.set(bucketTime, new Set())
      }

      if (event.event_type === 'view_start') {
        sessionCounts.get(bucketTime)!.add(event.session_id)
      }
    })

    // Convert to array format
    return Array.from(sessionCounts.entries())
      .map(([timestamp, sessions]) => ({
        timestamp,
        count: sessions.size
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  // Get event statistics
  const getEventStats = () => {
    const stats = {
      totalEvents: events.length,
      uniqueViewers: new Set(events.map(e => e.user_id)).size,
      viewStarts: events.filter(e => e.event_type === 'view_start').length,
      viewEnds: events.filter(e => e.event_type === 'view_end').length,
      interactions: events.filter(e => e.event_type === 'interaction').length,
    }
    return stats
  }

  // Simple chart component
  const SimpleChart: React.FC<{ data: ViewerCount[] }> = ({ data }) => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
          <p className="text-gray-400">No viewer data available</p>
        </div>
      )
    }

    const maxCount = Math.max(...data.map(d => d.count))
    const chartHeight = 200

    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Viewer Count Over Time</h3>
        <div className="flex items-end space-x-1 h-64">
          {data.map((point, index) => {
            const height = (point.count / maxCount) * chartHeight
            return (
              <div
                key={index}
                className="bg-blue-500 rounded-t flex-1 min-w-2"
                style={{ height: `${Math.max(height, 2)}px` }}
                title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.count} viewers`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{data[0] ? new Date(data[0].timestamp).toLocaleTimeString() : ''}</span>
          <span>{data[data.length - 1] ? new Date(data[data.length - 1].timestamp).toLocaleTimeString() : ''}</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Analytics Error</h1>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = getEventStats()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Analytics: {streamInfo?.title}
          </h1>
          <p className="text-gray-400">Stream slug: {streamInfo?.slug}</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['1h', '6h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {range === '1h' ? '1 Hour' :
                 range === '6h' ? '6 Hours' :
                 range === '24h' ? '24 Hours' : '7 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.totalEvents}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Unique Viewers</h3>
            <p className="text-3xl font-bold text-green-400">{stats.uniqueViewers}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">View Starts</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.viewStarts}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Interactions</h3>
            <p className="text-3xl font-bold text-purple-400">{stats.interactions}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart data={viewerCounts} />
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Event Types</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>View Starts</span>
                <span className="text-yellow-400 font-semibold">{stats.viewStarts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>View Ends</span>
                <span className="text-red-400 font-semibold">{stats.viewEnds}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Interactions</span>
                <span className="text-purple-400 font-semibold">{stats.interactions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.slice(-10).reverse().map((event) => (
              <div key={event.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.event_type === 'view_start' ? 'bg-green-600' :
                    event.event_type === 'view_end' ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}>
                    {event.event_type}
                  </span>
                  <span className="text-sm text-gray-300">
                    {event.user_id ? `User: ${event.user_id.slice(0, 8)}...` : 'Anonymous'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
