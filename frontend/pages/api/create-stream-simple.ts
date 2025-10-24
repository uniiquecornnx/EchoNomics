import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, slug } = req.body

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' })
    }

    // Mock stream data for testing with proper UUID format
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    const mockStreamId = generateUUID()
    const mockStreamKey = `sk_${Math.random().toString(36).substr(2, 32)}`
    const mockPlaybackId = `playback_${Math.random().toString(36).substr(2, 16)}`
    
    const rtmpIngestUrl = `rtmp://rtmp.livepeer.com/live/${mockStreamKey}`
    const hlsPlaybackUrl = `https://lvpr.tv/?v=${mockPlaybackId}`

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
      note: 'This is a mock stream for testing. Supabase integration disabled for now.'
    })

  } catch (error) {
    console.error('Error creating stream:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
