import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Missing NEXT_PUBLIC_LIVEPEER_API_KEY environment variable',
        hasApiKey: false
      });
    }

    return res.status(200).json({
      success: true,
      hasApiKey: true,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 8) + '...'
    });

  } catch (error) {
    console.error('Error testing Livepeer config:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
