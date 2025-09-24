import { NextApiRequest, NextApiResponse } from 'next';
import { BlockchainService } from '@/lib/blockchainService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { network, label } = req.body;

    // Validate input
    if (!network || !label) {
      return res.status(400).json({
        error: 'Missing required fields: network, label'
      });
    }

    // Validate network
    const supportedNetworks = ['bitcoin', 'ethereum', 'bsc', 'xrp', 'solana', 'tron'];
    if (!supportedNetworks.includes(network.toLowerCase())) {
      return res.status(400).json({
        error: `Unsupported network. Supported networks: ${supportedNetworks.join(', ')}`
      });
    }

    // Generate the wallet
    const generatedWallet = BlockchainService.generateWallet(network);

    // Return the generated wallet data
    return res.status(200).json({
      success: true,
      wallet: {
        network: generatedWallet.network,
        address: generatedWallet.address,
        privateKey: generatedWallet.privateKey,
        seedPhrase: generatedWallet.seedPhrase,
        destinationTag: generatedWallet.destinationTag,
        derivationPath: generatedWallet.derivationPath,
        label: label.trim()
      }
    });

  } catch (error) {
    console.error('Wallet generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate wallet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}