import type { NextApiRequest, NextApiResponse } from 'next';
import { BlockchainService } from '@/lib/blockchainService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, network } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }

  if (!network || typeof network !== 'string') {
    return res.status(400).json({ error: 'Network is required' });
  }

  const validNetworks = ['bitcoin', 'ethereum', 'bsc', 'xrp', 'solana', 'tron'];
  if (!validNetworks.includes(network)) {
    return res.status(400).json({ error: 'Invalid network' });
  }

  try {
    const data = await BlockchainService.getWalletData(
      address,
      network as 'bitcoin' | 'ethereum' | 'bsc' | 'xrp' | 'solana' | 'tron'
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching ${network} wallet data:`, error);
    return res.status(500).json({
      error: 'Failed to fetch wallet data',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
