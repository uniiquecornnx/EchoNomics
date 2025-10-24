import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, slug } = req.body

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' })
    }

    // Mock stream data for testing
    const mockStreamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const mockStreamKey = `sk_${Math.random().toString(36).substr(2, 32)}`
    const mockPlaybackId = `playback_${Math.random().toString(36).substr(2, 16)}`
    
    const rtmpIngestUrl = `rtmp://rtmp.livepeer.com/live/${mockStreamKey}`
    const hlsPlaybackUrl = `https://lvpr.tv/?v=${mockPlaybackId}`

    // Store stream info in Supabase
    const { data, error } = await supabase
      .from('streams')
      .insert([
        {
          title,
          slug,
          stream_id: mockStreamId,
          stream_key: mockStreamKey,
          playback_id: mockPlaybackId,
          ingest_url: rtmpIngestUrl,
          playback_url: hlsPlaybackUrl,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to store stream in database' })
    }

    return res.status(200).json({
      success: true,
      stream: {
        id: mockStreamId,
        title,
        slug,
        ingestUrl: rtmpIngestUrl,
        playbackUrl: hlsPlaybackUrl,
        streamKey: mockStreamKey,
        playbackId: mockPlaybackId,
      },
      database: data[0],
      note: 'This is a mock stream for testing. Replace with real Livepeer integration.'
    })

  } catch (error) {
    console.error('Error creating stream:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
