// Netlify Scheduled Function - runs every 5 minutes
// Monitors crypto payments and updates donation status

import { schedule } from '@netlify/functions';
import { getTypedSupabaseClient } from '../../lib/supabase';
import { verifyTransaction } from '../../lib/blockchainVerification';

const handler = schedule('*/5 * * * *', async (event) => {
  console.log('🔍 Starting crypto payment monitoring...');

  try {
    const client = getTypedSupabaseClient();

    // Get all pending crypto donations from last 48 hours
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const { data: pendingDonations, error } = await (client as any)
      .from('donations')
      .select('*')
      .eq('payment_method', 'cryptocurrency')
      .eq('status', 'pending')
      .gte('created_at', twoDaysAgo.toISOString());

    if (error) {
      console.error('❌ Error fetching pending donations:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error' })
      };
    }

    const results = {
      checked: 0,
      verified: 0,
      failed: 0,
      donations: [] as string[]
    };

    // Check each pending donation
    for (const donation of pendingDonations || []) {
      results.checked++;

      try {
        // Extract crypto network and wallet from metadata
        const network = donation.cryptocurrency_network || 'bitcoin';
        const walletAddress = getWalletForNetwork(network);
        const expectedAmount = donation.amount;
        const createdAt = new Date(donation.created_at);

        console.log(`Checking donation ${donation.id} on ${network}...`);

        // Verify transaction on blockchain
        const verification = await verifyTransaction(
          network,
          walletAddress,
          expectedAmount,
          createdAt
        );

        if (verification.verified) {
          // Update donation status to completed
          await (client as any)
            .from('donations')
            .update({
              status: 'completed',
              transaction_hash: verification.transactionHash,
              confirmed_at: new Date().toISOString(),
              blockchain_confirmations: verification.confirmations
            })
            .eq('id', donation.id);

          // TODO: Send thank you email
          // await sendDonationConfirmationEmail(donation);

          results.verified++;
          results.donations.push(donation.id);
          console.log(`✅ Verified donation ${donation.id}`);
        } else {
          console.log(`⏳ Donation ${donation.id} not yet confirmed`);
        }
      } catch (error) {
        console.error(`❌ Error verifying donation ${donation.id}:`, error);
        results.failed++;
      }
    }

    console.log('✅ Crypto monitoring complete:', results);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        ...results
      })
    };

  } catch (error) {
    console.error('❌ Scheduled function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
});

// Helper function to get wallet address for each network
function getWalletForNetwork(network: string): string {
  const wallets: { [key: string]: string } = {
    bitcoin: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || '',
    ethereum: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '',
    bsc: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '', // Same as ETH (EVM compatible)
    solana: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '',
    tron: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || '',
    xrp: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || '',
  };

  return wallets[network.toLowerCase()] || '';
}

export { handler };
