import { NextApiRequest, NextApiResponse } from 'next'
import { TIP_JAR_ADDRESSES } from '../../../lib/contracts'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { network } = req.query

    // Get contract address based on network
    let contractAddress: string | undefined;

    switch (network) {
      case 'base-sepolia':
        contractAddress = TIP_JAR_ADDRESSES.baseSepolia;
        break;
      case 'sepolia':
        contractAddress = TIP_JAR_ADDRESSES.sepolia;
        break;
      case 'localhost':
        contractAddress = TIP_JAR_ADDRESSES.localhost;
        break;
      default:
        contractAddress = TIP_JAR_ADDRESSES.baseSepolia; // Default to Base Sepolia
    }

    if (!contractAddress || contractAddress === '0x...') {
      return res.status(404).json({ 
        error: 'Contract address not configured for this network',
        network,
        availableNetworks: Object.keys(TIP_JAR_ADDRESSES)
      })
    }

    return res.status(200).json({
      success: true,
      network,
      contractAddress,
      availableNetworks: Object.keys(TIP_JAR_ADDRESSES)
    })

  } catch (error) {
    console.error('Error getting contract address:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
