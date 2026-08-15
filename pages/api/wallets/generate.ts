import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/serverAuth';

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(410).json({
    error: 'Wallet generation is disabled',
    message: 'Donation wallets must be created in a dedicated custody provider and configured through secure environment variables.'
  });
}

export default withAdminAuth(handler);
