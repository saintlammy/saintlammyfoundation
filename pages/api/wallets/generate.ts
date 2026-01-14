import { NextApiRequest, NextApiResponse } from 'next';

// Static wallet addresses - same as used in crypto.ts
const STATIC_WALLETS = {
  bitcoin: {
    network: 'bitcoin',
    address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    derivationPath: "m/44'/0'/0'/0/0"
  },
  ethereum: {
    network: 'ethereum',
    address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    derivationPath: "m/44'/60'/0'/0/0"
  },
  bsc: {
    network: 'bsc',
    address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    derivationPath: "m/44'/60'/0'/0/0"
  },
  xrp: {
    network: 'xrp',
    address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy',
    destinationTag: process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '12345678',
    derivationPath: "m/44'/144'/0'/0/0"
  },
  solana: {
    network: 'solana',
    address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '11111111111111111111111111111111',
    derivationPath: "m/44'/501'/0'/0'"
  },
  tron: {
    network: 'tron',
    address: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
    derivationPath: "m/44'/195'/0'/0/0"
  }
};

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

    // Get the existing static wallet for this network
    const staticWallet = STATIC_WALLETS[network.toLowerCase() as keyof typeof STATIC_WALLETS];

    if (!staticWallet) {
      return res.status(500).json({
        error: `No static wallet configured for ${network} network`
      });
    }

    // Return the existing wallet data (no private keys for security)
    return res.status(200).json({
      success: true,
      wallet: {
        network: staticWallet.network,
        address: staticWallet.address,
        privateKey: '***HIDDEN***', // Don't expose private keys
        seedPhrase: '***HIDDEN***', // Don't expose seed phrases
        destinationTag: (staticWallet as any).destinationTag,
        derivationPath: staticWallet.derivationPath,
        label: label.trim()
      }
    });

  } catch (error) {
    console.error('Wallet retrieval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve wallet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}