import { NextApiRequest, NextApiResponse } from 'next'
import { createStream } from '../../lib/livepeerClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Testing Livepeer API call...');
    
    const streamResponse = await createStream('Test Stream', true);
    
    console.log('Livepeer response:', streamResponse);
    
    return res.status(200).json({
      success: true,
      streamResponse,
      message: 'Livepeer API call successful'
    });

  } catch (error) {
    console.error('Error testing Livepeer API:', error);
    return res.status(500).json({ 
      error: 'Livepeer API call failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
