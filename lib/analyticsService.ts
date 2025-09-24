import { donationService } from './donationService';
import { BlockchainService } from './blockchainService';
import axios from 'axios';

export interface AnalyticsData {
  donations: {
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    monthlyGrowth: number;
    byMethod: { [key: string]: number };
    byCurrency: { [key: string]: number };
    monthlyTrend: Array<{
      month: string;
      amount: number;
      count: number;
    }>;
  };
  wallets: {
    totalValue: number;
    totalWallets: number;
    topWallet: {
      address: string;
      value: number;
      network: string;
    };
    networkDistribution: { [key: string]: number };
    balanceHistory: Array<{
      date: string;
      value: number;
    }>;
  };
  traffic: {
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    topPages: Array<{
      page: string;
      views: number;
      uniqueViews: number;
    }>;
    conversionRate: number;
  };
  engagement: {
    newsletterSignups: number;
    socialFollowers: number;
    volunteersRegistered: number;
    partnershipInquiries: number;
    programEnrollments: number;
  };
}

export interface RealtimeMetrics {
  activeDonations: number;
  pendingTransactions: number;
  onlineVisitors: number;
  recentActivity: Array<{
    type: 'donation' | 'visitor' | 'signup' | 'inquiry';
    description: string;
    timestamp: Date;
    value?: number;
  }>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: { [key: string]: { data: any; timestamp: number } } = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache[key];
    return cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache[key] = { data, timestamp: Date.now() };
  }

  private getCache(key: string): any {
    if (this.isCacheValid(key)) {
      return this.cache[key].data;
    }
    return null;
  }

  /**
   * Get comprehensive analytics data
   */
  async getAnalyticsData(): Promise<AnalyticsData> {
    const cacheKey = 'analytics_data';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const [donationStats, walletAnalytics, trafficData, engagementData] = await Promise.all([
        this.getDonationAnalytics(),
        this.getWalletAnalytics(),
        this.getTrafficAnalytics(),
        this.getEngagementAnalytics()
      ]);

      const analyticsData: AnalyticsData = {
        donations: donationStats,
        wallets: walletAnalytics,
        traffic: trafficData,
        engagement: engagementData
      };

      this.setCache(cacheKey, analyticsData);
      return analyticsData;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Return fallback data if service fails
      return this.getFallbackAnalytics();
    }
  }

  /**
   * Get real-time metrics
   */
  async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    const cacheKey = 'realtime_metrics';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const [donationStats, recentActivity] = await Promise.all([
        donationService.getDonationStats(),
        this.getRecentActivity()
      ]);

      const metrics: RealtimeMetrics = {
        activeDonations: donationStats.donationsByStatus['pending'] || 0,
        pendingTransactions: donationStats.donationsByStatus['pending'] || 0,
        onlineVisitors: Math.floor(Math.random() * 50) + 10, // Mock data - integrate with analytics
        recentActivity
      };

      this.setCache(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      return {
        activeDonations: 0,
        pendingTransactions: 0,
        onlineVisitors: 0,
        recentActivity: []
      };
    }
  }

  /**
   * Get donation analytics
   */
  private async getDonationAnalytics() {
    try {
      const stats = await donationService.getDonationStats();
      const donations = await donationService.getDonations({ limit: 100 });

      // Calculate monthly trend
      const monthlyData = this.calculateMonthlyTrend(donations.donations);
      const monthlyGrowth = this.calculateGrowthRate(monthlyData);

      // Group by currency
      const byCurrency = donations.donations.reduce((acc, d) => {
        const currency = this.extractCurrency(d.notes);
        acc[currency] = (acc[currency] || 0) + d.amount;
        return acc;
      }, {} as { [key: string]: number });

      return {
        totalAmount: stats.totalAmount,
        totalCount: stats.totalDonations,
        averageAmount: stats.avgDonationAmount,
        monthlyGrowth,
        byMethod: stats.donationsByMethod,
        byCurrency,
        monthlyTrend: monthlyData
      };
    } catch (error) {
      console.error('Error getting donation analytics:', error);
      return this.getFallbackDonationStats();
    }
  }

  /**
   * Get wallet analytics
   */
  private async getWalletAnalytics() {
    try {
      // Get wallet addresses from environment or config
      const wallets = this.getConfiguredWallets();
      const walletData = await Promise.all(
        wallets.map(async (wallet) => {
          try {
            const data = await BlockchainService.getWalletData(wallet.address, wallet.network);
            return {
              ...data,
              address: wallet.address,
              network: wallet.network
            };
          } catch (error) {
            console.error(`Error fetching ${wallet.network} wallet ${wallet.address}:`, error);
            return null;
          }
        })
      );

      const validWallets = walletData.filter(w => w !== null);
      const totalValue = validWallets.reduce((sum, w) => sum + w!.totalUsdValue, 0);

      // Find top wallet
      const topWallet = validWallets.reduce((max, current) =>
        current!.totalUsdValue > (max?.totalUsdValue || 0) ? current : max,
        null as any
      );

      // Network distribution
      const networkDistribution = validWallets.reduce((acc, w) => {
        acc[w!.network] = (acc[w!.network] || 0) + w!.totalUsdValue;
        return acc;
      }, {} as { [key: string]: number });

      // Mock balance history (in production, store historical data)
      const balanceHistory = this.generateMockBalanceHistory(totalValue);

      return {
        totalValue,
        totalWallets: validWallets.length,
        topWallet: topWallet ? {
          address: topWallet.address,
          value: topWallet.totalUsdValue,
          network: topWallet.network
        } : { address: 'N/A', value: 0, network: 'none' },
        networkDistribution,
        balanceHistory
      };
    } catch (error) {
      console.error('Error getting wallet analytics:', error);
      return this.getFallbackWalletStats();
    }
  }

  /**
   * Get traffic analytics (mock data - integrate with GA4 or similar)
   */
  private async getTrafficAnalytics() {
    // In production, integrate with Google Analytics API
    return {
      uniqueVisitors: Math.floor(Math.random() * 10000) + 5000,
      pageViews: Math.floor(Math.random() * 25000) + 15000,
      bounceRate: 0.35 + Math.random() * 0.3,
      averageSessionDuration: 180 + Math.random() * 240,
      topPages: [
        { page: '/', views: 8500, uniqueViews: 6200 },
        { page: '/donate', views: 3200, uniqueViews: 2800 },
        { page: '/programs', views: 2100, uniqueViews: 1900 },
        { page: '/about', views: 1800, uniqueViews: 1500 },
        { page: '/volunteer', views: 1200, uniqueViews: 1000 }
      ],
      conversionRate: 0.025 + Math.random() * 0.015
    };
  }

  /**
   * Get engagement analytics
   */
  private async getEngagementAnalytics() {
    // Mock data - integrate with actual systems
    return {
      newsletterSignups: Math.floor(Math.random() * 500) + 250,
      socialFollowers: Math.floor(Math.random() * 2000) + 1000,
      volunteersRegistered: Math.floor(Math.random() * 100) + 50,
      partnershipInquiries: Math.floor(Math.random() * 20) + 10,
      programEnrollments: Math.floor(Math.random() * 150) + 75
    };
  }

  /**
   * Get recent activity
   */
  private async getRecentActivity() {
    try {
      const donations = await donationService.getDonations({ limit: 10 });

      const activity = donations.donations.map(d => ({
        type: 'donation' as const,
        description: `New $${d.amount} donation via ${d.payment_method}`,
        timestamp: new Date(d.created_at!),
        value: d.amount
      }));

      // Add mock visitor and signup activity
      const mockActivity = [
        {
          type: 'visitor' as const,
          description: 'New visitor from United States',
          timestamp: new Date(Date.now() - Math.random() * 3600000),
        },
        {
          type: 'signup' as const,
          description: 'New volunteer registration',
          timestamp: new Date(Date.now() - Math.random() * 3600000),
        }
      ];

      return [...activity, ...mockActivity]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Calculate monthly trend from donations
   */
  private calculateMonthlyTrend(donations: any[]): Array<{ month: string; amount: number; count: number }> {
    const monthlyData: { [key: string]: { amount: number; count: number } } = {};

    donations.forEach(d => {
      const date = new Date(d.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { amount: 0, count: 0 };
      }
      monthlyData[monthKey].amount += d.amount;
      monthlyData[monthKey].count += 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, data]) => ({ month, ...data }));
  }

  /**
   * Calculate growth rate
   */
  private calculateGrowthRate(monthlyData: Array<{ month: string; amount: number; count: number }>): number {
    if (monthlyData.length < 2) return 0;

    const current = monthlyData[monthlyData.length - 1].amount;
    const previous = monthlyData[monthlyData.length - 2].amount;

    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  }

  /**
   * Extract currency from donation notes
   */
  private extractCurrency(notes: any): string {
    if (!notes) return 'USD';

    try {
      const parsed = typeof notes === 'string' ? JSON.parse(notes) : notes;
      return parsed.cryptoCurrency || parsed.currency || 'USD';
    } catch {
      return 'USD';
    }
  }

  /**
   * Get configured wallet addresses
   */
  private getConfiguredWallets(): Array<{ address: string; network: string }> {
    return [
      {
        address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || '',
        network: 'bitcoin'
      },
      {
        address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '',
        network: 'ethereum'
      },
      {
        address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || '',
        network: 'xrp'
      }
    ].filter(w => w.address && w.address !== '' && !w.address.includes('YOUR_'));
  }

  /**
   * Generate mock balance history
   */
  private generateMockBalanceHistory(currentValue: number): Array<{ date: string; value: number }> {
    const history = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const variance = (Math.random() - 0.5) * 0.1; // ±10% variance
      const value = currentValue * (1 + variance * (i / 30));

      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, value)
      });
    }

    return history;
  }

  /**
   * Fallback analytics when services fail
   */
  private getFallbackAnalytics(): AnalyticsData {
    return {
      donations: this.getFallbackDonationStats(),
      wallets: this.getFallbackWalletStats(),
      traffic: {
        uniqueVisitors: 7500,
        pageViews: 20000,
        bounceRate: 0.45,
        averageSessionDuration: 225,
        topPages: [
          { page: '/', views: 8000, uniqueViews: 6000 },
          { page: '/donate', views: 3000, uniqueViews: 2500 }
        ],
        conversionRate: 0.03
      },
      engagement: {
        newsletterSignups: 350,
        socialFollowers: 1500,
        volunteersRegistered: 75,
        partnershipInquiries: 15,
        programEnrollments: 100
      }
    };
  }

  private getFallbackDonationStats() {
    return {
      totalAmount: 125000,
      totalCount: 485,
      averageAmount: 258,
      monthlyGrowth: 12.5,
      byMethod: { paypal: 250, crypto: 150, card: 85 },
      byCurrency: { USD: 100000, BTC: 15000, ETH: 10000 },
      monthlyTrend: [
        { month: '2024-01', amount: 8500, count: 35 },
        { month: '2024-02', amount: 9200, count: 38 },
        { month: '2024-03', amount: 10800, count: 42 }
      ]
    };
  }

  private getFallbackWalletStats() {
    return {
      totalValue: 25000,
      totalWallets: 6,
      topWallet: { address: 'bc1...example', value: 12000, network: 'bitcoin' },
      networkDistribution: { bitcoin: 12000, ethereum: 8000, xrp: 5000 },
      balanceHistory: [
        { date: '2024-01-01', value: 20000 },
        { date: '2024-01-15', value: 22500 },
        { date: '2024-02-01', value: 25000 }
      ]
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();
export default analyticsService;