import { NextApiRequest, NextApiResponse } from 'next'
import { createStream } from '../../lib/livepeerClient'
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

    // Create stream using Livepeer
    const streamResponse = await createStream(title, true) // Enable recording
    
    if (!streamResponse || !streamResponse.id || !streamResponse.streamKey || !streamResponse.playbackId) {
      throw new Error('Failed to create Livepeer stream or missing essential data')
    }

    const { id, streamKey, playbackId } = streamResponse
    const rtmpIngestUrl = `rtmp://rtmp.livepeer.com/live/${streamKey}`
    const hlsPlaybackUrl = `https://lvpr.tv/?v=${playbackId}`

    // Store stream info in Supabase
    const { data, error } = await supabase
      .from('streams')
      .insert([
        {
          title,
          slug,
          stream_id: id,
          stream_key: streamKey,
          playback_id: playbackId,
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
        id,
        title,
        slug,
        ingestUrl: rtmpIngestUrl,
        playbackUrl: hlsPlaybackUrl,
        streamKey,
        playbackId,
      },
      database: data[0]
    })

  } catch (error) {
    console.error('Error creating stream:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
