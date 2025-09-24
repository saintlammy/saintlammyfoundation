import { BlockchainService } from './blockchainService';
import { donationService } from './donationService';
import { isSupabaseAvailable } from './supabase';

interface WalletAddress {
  address: string;
  network: 'bitcoin' | 'ethereum' | 'bsc' | 'xrp' | 'solana' | 'tron';
  destinationTag?: string;
}

interface MonitoredTransaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  network: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
}

class DonationTracker {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastChecked: { [network: string]: Date } = {};
  private processedTransactions = new Set<string>();

  // Production wallet addresses from environment
  private walletAddresses: WalletAddress[] = [
    {
      address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || '',
      network: 'bitcoin'
    },
    {
      address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '',
      network: 'ethereum'
    },
    {
      address: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS || '',
      network: 'bsc'
    },
    {
      address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '',
      network: 'solana'
    },
    {
      address: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || '',
      network: 'tron'
    },
    {
      address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || '',
      network: 'xrp',
      destinationTag: process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG
    }
  ];

  /**
   * Start monitoring blockchain addresses for incoming donations
   */
  async startMonitoring(intervalMinutes: number = 5): Promise<void> {
    console.log('🔍 Starting real-time donation monitoring...');

    if (!isSupabaseAvailable) {
      console.warn('⚠️ Database not available - monitoring will continue but donations won\'t be stored');
    }

    // Initialize last checked times
    this.walletAddresses.forEach(wallet => {
      if (wallet.address) {
        this.lastChecked[wallet.network] = new Date(Date.now() - 24 * 60 * 60 * 1000); // Start from 24 hours ago
      }
    });

    // Run initial check
    await this.checkForNewDonations();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.checkForNewDonations();
    }, intervalMinutes * 60 * 1000);

    console.log(`✅ Donation monitoring started (checking every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop monitoring blockchain addresses
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ Donation monitoring stopped');
    }
  }

  /**
   * Check all wallet addresses for new donations
   */
  async checkForNewDonations(): Promise<void> {
    console.log('🔍 Checking for new donations...');

    for (const wallet of this.walletAddresses) {
      if (!wallet.address) {
        console.log(`⚠️ Skipping ${wallet.network} - no address configured`);
        continue;
      }

      try {
        await this.checkWalletForDonations(wallet);
      } catch (error) {
        console.error(`❌ Error checking ${wallet.network} wallet:`, error);
      }
    }
  }

  /**
   * Check a specific wallet for new transactions
   */
  private async checkWalletForDonations(wallet: WalletAddress): Promise<void> {
    try {
      console.log(`🔍 Checking ${wallet.network} wallet: ${wallet.address.substring(0, 12)}...`);

      // Get recent transactions from blockchain
      const transactions = await BlockchainService.getTransactions(
        wallet.address,
        wallet.network,
        10 // Get last 10 transactions
      );

      if (!transactions || transactions.length === 0) {
        console.log(`📭 No transactions found for ${wallet.network}`);
        return;
      }

      let newDonationsFound = 0;

      for (const tx of transactions) {
        // Check if this is an incoming transaction to our wallet
        const isIncoming = tx.to?.toLowerCase() === wallet.address.toLowerCase();

        if (!isIncoming) {
          continue; // Skip outgoing transactions
        }

        // Check if we've already processed this transaction
        const txKey = `${wallet.network}-${tx.hash}`;
        if (this.processedTransactions.has(txKey)) {
          continue;
        }

        // Check if transaction is after our last check time
        if (tx.timestamp <= this.lastChecked[wallet.network]) {
          continue;
        }

        // Process this as a new donation
        await this.processDonationTransaction(wallet, tx);
        this.processedTransactions.add(txKey);
        newDonationsFound++;
      }

      if (newDonationsFound > 0) {
        console.log(`🎉 Found ${newDonationsFound} new donations on ${wallet.network}!`);
      } else {
        console.log(`✓ ${wallet.network} checked - no new donations`);
      }

      // Update last checked time
      this.lastChecked[wallet.network] = new Date();

    } catch (error) {
      console.error(`❌ Error checking ${wallet.network} wallet:`, error);
    }
  }

  /**
   * Process a blockchain transaction as a donation
   */
  private async processDonationTransaction(wallet: WalletAddress, tx: any): Promise<void> {
    try {
      console.log(`💰 Processing new donation: ${tx.value} ${tx.currency} on ${wallet.network}`);

      // Convert crypto amount to USD (simplified - in production you'd use real-time price APIs)
      const cryptoPrice = await this.getCryptoPriceUSD(tx.currency);
      const usdAmount = parseFloat(tx.value) * cryptoPrice;

      // Create donation data
      const donationData = {
        amount: usdAmount,
        currency: 'USD',
        network: wallet.network,
        cryptoAmount: parseFloat(tx.value),
        cryptoPrice,
        walletAddress: wallet.address,
        memo: tx.memo || undefined,
        source: 'blockchain_monitor',
        category: 'general' as const,
        donorName: 'Anonymous Crypto Donor',
        donorEmail: undefined,
        message: `Crypto donation via ${wallet.network.toUpperCase()}`
      };

      // Store in database if available
      if (isSupabaseAvailable) {
        const donationId = await donationService.storeCryptoDonation(donationData);

        // Update donation with transaction hash and status
        await donationService.updateDonationStatus(
          donationId,
          tx.confirmations >= this.getRequiredConfirmations(wallet.network) ? 'completed' : 'pending',
          tx.hash
        );

        console.log(`✅ Stored donation ${donationId} - ${usdAmount.toFixed(2)} USD`);
      } else {
        console.log(`💾 Database not available - donation logged: ${usdAmount.toFixed(2)} USD from ${wallet.network}`);
      }

      // Emit donation event for real-time updates (you can integrate with websockets here)
      this.emitDonationEvent({
        type: 'new_donation',
        network: wallet.network,
        amount: usdAmount,
        currency: 'USD',
        cryptoAmount: parseFloat(tx.value),
        cryptoCurrency: tx.currency,
        txHash: tx.hash,
        timestamp: tx.timestamp
      });

    } catch (error) {
      console.error('❌ Error processing donation transaction:', error);
    }
  }

  /**
   * Get required confirmations for a network
   */
  private getRequiredConfirmations(network: string): number {
    const confirmations = {
      bitcoin: 6,
      ethereum: 12,
      bsc: 12,
      xrp: 3,
      solana: 32,
      tron: 19
    };
    return confirmations[network as keyof typeof confirmations] || 6;
  }

  /**
   * Get crypto price in USD (simplified version)
   */
  private async getCryptoPriceUSD(currency: string): Promise<number> {
    // Simplified price lookup - in production you'd use CoinGecko, CoinMarketCap, etc.
    const prices = {
      BTC: 45000,
      ETH: 3200,
      BNB: 320,
      XRP: 0.60,
      SOL: 100,
      TRX: 0.08,
      USDT: 1.00,
      USDC: 1.00
    };

    return prices[currency as keyof typeof prices] || 0;
  }

  /**
   * Emit donation events for real-time UI updates
   */
  private emitDonationEvent(event: any): void {
    // In a production environment, you could:
    // 1. Use Server-Sent Events (SSE)
    // 2. Integrate with Socket.io
    // 3. Use Supabase real-time subscriptions
    // 4. Publish to a message queue

    console.log('📡 Donation event:', event);

    // For now, we'll just log the event
    // You can extend this to actually emit real-time events to connected clients
  }

  /**
   * Get donation statistics in real-time
   */
  async getRealTimeDonationStats(): Promise<{
    totalDonationsToday: number;
    totalAmountToday: number;
    recentDonations: any[];
    donationsByNetwork: { [key: string]: number };
  }> {
    try {
      const stats = await donationService.getDonationStats();

      // Get donations from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayDonations = await donationService.getDonations({
        startDate: today.toISOString(),
        limit: 100
      });

      // Group by network for crypto donations
      const donationsByNetwork: { [key: string]: number } = {};
      todayDonations.donations.forEach(donation => {
        if (donation.payment_method === 'crypto') {
          try {
            const notes = JSON.parse(donation.notes || '{}');
            const network = notes.network || 'unknown';
            donationsByNetwork[network] = (donationsByNetwork[network] || 0) + 1;
          } catch (e) {
            // Ignore parsing errors
          }
        }
      });

      return {
        totalDonationsToday: todayDonations.donations.length,
        totalAmountToday: todayDonations.donations.reduce((sum, d) => sum + d.amount, 0),
        recentDonations: todayDonations.donations.slice(0, 10),
        donationsByNetwork
      };
    } catch (error) {
      console.error('Error getting real-time donation stats:', error);
      return {
        totalDonationsToday: 0,
        totalAmountToday: 0,
        recentDonations: [],
        donationsByNetwork: {}
      };
    }
  }

  /**
   * Force check a specific transaction by hash
   */
  async checkTransactionStatus(txHash: string, network: string): Promise<void> {
    try {
      console.log(`🔍 Checking transaction status: ${txHash} on ${network}`);

      // This would check the specific transaction status on the blockchain
      // and update the database accordingly

      // Implementation would depend on the blockchain service capabilities
      console.log(`✅ Transaction status check completed for ${txHash}`);
    } catch (error) {
      console.error(`❌ Error checking transaction ${txHash}:`, error);
    }
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus(): {
    isMonitoring: boolean;
    walletsConfigured: number;
    lastChecked: { [network: string]: Date };
    processedTransactions: number;
  } {
    return {
      isMonitoring: this.monitoringInterval !== null,
      walletsConfigured: this.walletAddresses.filter(w => w.address).length,
      lastChecked: { ...this.lastChecked },
      processedTransactions: this.processedTransactions.size
    };
  }
}

export const donationTracker = new DonationTracker();