import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'
import { nexusBridge } from '../../lib/nexus'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { txHash, streamId, amountWei, fromAddress, toAddress, isCrossChain } = req.body

    // Validate required fields
    if (!txHash || !streamId || !amountWei) {
      return res.status(400).json({ 
        error: 'txHash, streamId, and amountWei are required' 
      })
    }

    // Validate txHash format (basic Ethereum hash validation)
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return res.status(400).json({ 
        error: 'Invalid transaction hash format' 
      })
    }

    // Validate amountWei is a positive number
    if (isNaN(Number(amountWei)) || Number(amountWei) <= 0) {
      return res.status(400).json({ 
        error: 'amountWei must be a positive number' 
      })
    }

    // Prepare the tip data
    const tipData = {
      tx_hash: txHash,
      stream_id: streamId,
      amount_wei: amountWei,
      from_address: fromAddress || null,
      to_address: toAddress || null,
      is_cross_chain: isCrossChain || false,
      created_at: new Date().toISOString(),
    }

    // Store tip in Supabase
    const { data, error } = await supabase
      .from('tips')
      .insert([tipData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to store tip transaction' })
    }

    // If this is a cross-chain tip, trigger the relay to Avail
    if (isCrossChain) {
      try {
        console.log('Cross-chain tip detected, initiating relay to Avail...')
        // The relay will be handled by the event listener in nexus.ts
        // This is just for logging and potential future enhancements
      } catch (relayError) {
        console.error('Failed to initiate cross-chain relay:', relayError)
        // Don't fail the main request if relay fails
      }
    }

    return res.status(200).json({
      success: true,
      tip: data[0],
      crossChainRelay: isCrossChain ? 'initiated' : 'not_applicable'
    })

  } catch (error) {
    console.error('Error storing tip:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
