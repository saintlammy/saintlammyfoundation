import type { NextApiResponse } from 'next';
import { withAdminAuth, type AdminApiRequest } from '@/lib/serverAuth';

async function handler(req: AdminApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const wallets = [
    { network: 'bitcoin', label: 'Bitcoin', address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS },
    { network: 'ethereum', label: 'Ethereum', address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS },
    { network: 'bsc', label: 'BNB Smart Chain', address: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS },
    { network: 'solana', label: 'Solana', address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS },
    { network: 'xrp', label: 'XRP Ledger', address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS, destinationTag: process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG },
    { network: 'tron', label: 'Tron', address: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || process.env.NEXT_PUBLIC_TRON_WALLET_ADDRESS }
  ].map((wallet) => ({
    ...wallet,
    configured: Boolean(wallet.address),
    address: wallet.address || null,
    destinationTag: wallet.destinationTag || null
  }));

  return res.status(200).json({
    success: true,
    data: wallets,
    summary: {
      configured: wallets.filter((wallet) => wallet.configured).length,
      total: wallets.length
    }
  });
}

export default withAdminAuth(handler);
