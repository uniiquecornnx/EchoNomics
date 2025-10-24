import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      event_type, 
      stream_id, 
      user_id, 
      session_id, 
      timestamp, 
      metadata 
    } = req.body

    // Validate required fields
    if (!event_type) {
      return res.status(400).json({ error: 'event_type is required' })
    }

    // Prepare the analytics event data
    const eventData = {
      event_type,
      stream_id: stream_id || null,
      user_id: user_id || null,
      session_id: session_id || null,
      timestamp: timestamp || new Date().toISOString(),
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    }

    // Store event in Supabase
    const { data, error } = await supabase
      .from('analytics_events')
      .insert([eventData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to store analytics event' })
    }

    return res.status(200).json({
      success: true,
      event: data[0]
    })

  } catch (error) {
    console.error('Error storing analytics event:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
