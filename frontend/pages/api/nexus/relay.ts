import { NextApiRequest, NextApiResponse } from 'next'
import { nexusBridge } from '../../../lib/nexus'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action } = req.body

    switch (action) {
      case 'start_relay':
        await nexusBridge.startTipRelay()
        return res.status(200).json({ 
          success: true, 
          message: 'Tip relay started successfully' 
        })

      case 'get_status':
        const status = await nexusBridge.getBridgeStatus()
        return res.status(200).json({ 
          success: true, 
          status 
        })

      case 'get_chains':
        const chains = nexusBridge.getAvailableChains()
        return res.status(200).json({ 
          success: true, 
          chains 
        })

      default:
        return res.status(400).json({ 
          error: 'Invalid action. Use: start_relay, get_status, or get_chains' 
        })
    }

  } catch (error) {
    console.error('Nexus relay error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
