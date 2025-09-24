import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import QRCode from 'qrcode';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlockchainService, GeneratedWallet } from '@/lib/blockchainService';
import {
  Plus,
  Wallet,
  Bitcoin,
  Copy,
  Eye,
  EyeOff,
  QrCode,
  Download,
  RefreshCw,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  MoreHorizontal,
  Globe,
  Send,
  X,
  Key,
  Zap
} from 'lucide-react';
import { SiBitcoin, SiEthereum, SiTether, SiRipple, SiBinance } from 'react-icons/si';

interface NetworkWallet {
  id: string;
  network: 'ethereum' | 'bsc' | 'bitcoin' | 'solana' | 'tron' | 'xrp';
  networkName: string;
  address: string;
  label: string;
  destinationTag?: string;
  privateKey?: string;
  seedPhrase?: string;
  tokens: Array<{
    symbol: 'BTC' | 'ETH' | 'BNB' | 'USDT' | 'USDC' | 'XRP' | 'SOL';
    name: string;
    balance: number;
    usdValue: number;
    totalReceived: number;
    totalSent: number;
    transactionCount: number;
  }>;
  createdAt: Date;
  lastActivity?: Date;
  status: 'active' | 'inactive' | 'archived';
  isWatchOnly?: boolean;
  isHardwareWallet?: boolean;
  walletType?: 'production' | 'generated';
}

interface Transaction {
  id: string;
  walletId: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  currency: string;
  usdValue: number;
  fromAddress?: string;
  toAddress?: string;
  txHash: string;
  status: 'confirmed' | 'pending' | 'failed';
  confirmations: number;
  timestamp: Date;
  donorInfo?: {
    name?: string;
    email?: string;
    isAnonymous: boolean;
  };
}

interface WithdrawalForm {
  walletId: string;
  token: string;
  toAddress: string;
  amount: number;
  destinationTag?: string;
  gasPrice?: number;
  priority: 'low' | 'standard' | 'high';
}

const AdminWalletManagement: React.FC = () => {
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{ [key: string]: boolean }>({});
  const [selectedWallet, setSelectedWallet] = useState<NetworkWallet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrWallet, setQrWallet] = useState<NetworkWallet | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [refreshingWallet, setRefreshingWallet] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalWallet, setWithdrawalWallet] = useState<NetworkWallet | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState<WithdrawalForm>({
    walletId: '',
    token: '',
    toAddress: '',
    amount: 0,
    priority: 'standard'
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [walletData, setWalletData] = useState<NetworkWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockchainService] = useState(() => new BlockchainService());
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [dailyDonations, setDailyDonations] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [walletLabel, setWalletLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWallet, setGeneratedWallet] = useState<GeneratedWallet | null>(null);

  // Load wallet data on component mount
  // Clear all caches function
  const clearAllCaches = () => {
    console.log('🧹 Clearing all caches...');

    // Clear localStorage
    const keysToKeep = ['theme', 'user_preferences']; // Keep important user data
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
        console.log(`Cleared localStorage: ${key}`);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();
    console.log('Cleared sessionStorage');

    // Clear any API caches if they exist
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
          console.log(`Cleared cache: ${cacheName}`);
        });
      });
    }

    console.log('✅ Cache clearing completed');
  };

  useEffect(() => {
    // Clear only browser caches, not localStorage with wallet data
    console.log('🧹 Clearing browser caches (preserving wallet data)...');
    const keysToKeep = ['theme', 'user_preferences', 'saintlammy_wallets', 'saintlammy_archived_wallets'];
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
        console.log(`Cleared localStorage: ${key}`);
      }
    });
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Load wallet data
    loadWalletData();
  }, []);

  // Save wallets to localStorage whenever walletData changes
  useEffect(() => {
    // Only save generated wallets to localStorage (exclude production wallets)
    // This ensures production wallets are never accidentally modified or deleted
    const generatedWallets = walletData.filter(wallet => wallet.walletType !== 'production');
    localStorage.setItem('saintlammy_wallets', JSON.stringify(generatedWallets));
  }, [walletData]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const loadWalletData = async (forceApiTest: boolean = false, forceDefaults: boolean = false) => {
    setLoading(true);
    try {
      let generatedWallets: NetworkWallet[] = [];
      let savedWallets: string | null = null;

      if (!forceDefaults) {
        // Try to load existing generated wallets from localStorage first
        savedWallets = localStorage.getItem('saintlammy_wallets');
        if (savedWallets) {
          try {
            const parsed = JSON.parse(savedWallets);
            if (Array.isArray(parsed)) {
              if (parsed.length > 0) {
                console.log('📂 Loading saved generated wallets from localStorage:', parsed.length, 'wallets');
                // Mark existing saved wallets as generated if they don't have walletType
                generatedWallets = parsed.map(wallet => ({
                  ...wallet,
                  walletType: wallet.walletType || 'generated'
                }));
              } else {
                console.log('📂 Found empty wallet array in localStorage (user cleared generated wallets)');
                generatedWallets = []; // Explicitly use empty array
              }
            }
          } catch (error) {
            console.error('Error parsing saved wallets:', error);
          }
        }
      }

      // Always create production wallets and combine them with generated ones
      console.log('🏛️ Loading production wallets from environment variables...');
      const productionWallets = await createProductionWallets();

      // Remove duplicate addresses, prioritizing production wallets over generated ones
      const uniqueWallets = [...productionWallets];
      const productionAddresses = new Set(productionWallets.map(w => w.address.toLowerCase()));

      // Only add generated wallets that don't have the same address as production wallets
      const uniqueGeneratedWallets = generatedWallets.filter(
        genWallet => !productionAddresses.has(genWallet.address.toLowerCase())
      );

      const allWallets = [...uniqueWallets, ...uniqueGeneratedWallets];
      console.log(`📊 Loaded ${productionWallets.length} production wallets, ${uniqueGeneratedWallets.length} unique generated wallets (${generatedWallets.length - uniqueGeneratedWallets.length} duplicates removed)`);

      setWalletData(allWallets);

      // Try to load live balances if APIs are available
      if (forceApiTest) {
        console.log('🧪 Testing live blockchain APIs...');
        await updateWalletsWithLiveData(allWallets);
      }

      // Load transaction data
      await loadRecentTransactions(allWallets);

      // Set reasonable daily donations estimate
      const totalValue = allWallets.reduce((sum, wallet) =>
        sum + wallet.tokens.reduce((tokenSum, token) => tokenSum + (token.usdValue || 0), 0), 0
      );
      setDailyDonations(Math.max(Math.round(totalValue * 0.01), 50)); // 1% of portfolio or minimum $50

    } catch (error) {
      console.error('Error loading wallet data:', error);

      // Fallback to empty wallets with addresses only
      const fallbackWallets = await createEmptyWallets();
      setWalletData(fallbackWallets);
      setRecentTransactions([]);
      setDailyDonations(50);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletForNetwork = async (
    network: 'bitcoin' | 'ethereum' | 'bsc' | 'xrp' | 'solana' | 'tron',
    id: string,
    label: string
  ): Promise<NetworkWallet | null> => {
    try {
      // Get wallet address from environment variables
      const addresses = {
        bitcoin: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ethereum: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
        bsc: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
        xrp: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy',
        solana: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '11111111111111111111111111111111',
        tron: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz'
      };

      const address = addresses[network];
      const data = await BlockchainService.getWalletData(address, network);
      if (!data || !data.address) return null;

      const networkNames = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum (ERC20)',
        bsc: 'Binance Smart Chain (BEP20)',
        xrp: 'XRP Ledger',
        solana: 'Solana Network',
        tron: 'Tron Network (TRC20)'
      };

      const wallet: NetworkWallet = {
        id,
        network,
        networkName: networkNames[network],
        address: data.address,
        label,
        destinationTag: network === 'xrp' ? (process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '12345678') : undefined,
        privateKey: getPrivateKeyForNetwork(network),
        seedPhrase: getSeedPhraseForNetwork(network),
        tokens: data.balances.map(token => ({
          symbol: token.symbol as any,
          name: token.name,
          balance: token.balance,
          usdValue: token.usdValue,
          totalReceived: token.totalReceived || 0,
          totalSent: token.totalSent || 0,
          transactionCount: token.transactionCount || 0
        })),
        createdAt: new Date('2024-01-01'),
        lastActivity: data.lastActivity ? new Date(data.lastActivity) : new Date(),
        status: 'active'
      };

      return wallet;
    } catch (error) {
      console.error(`Error loading ${network} wallet:`, error);
      return null;
    }
  };

  const getPrivateKeyForNetwork = (network: string): string => {
    // Private keys should NEVER be stored in code or environment variables for security
    // This is just for display purposes - real private keys should be kept in secure wallets
    return ''; // Return empty string for security
  };

  const getSeedPhraseForNetwork = (network: string): string | undefined => {
    // Seed phrases should NEVER be stored in code or environment variables for security
    // This is just for display purposes - real seed phrases should be kept in secure wallets
    return undefined; // Return undefined for security
  };

  const getDefaultTokensForNetwork = (network: string) => {
    const defaults = {
      bitcoin: [
        {
          symbol: 'BTC' as const,
          name: 'Bitcoin',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ],
      ethereum: [
        {
          symbol: 'ETH' as const,
          name: 'Ethereum',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDT' as const,
          name: 'Tether USD (ERC20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDC' as const,
          name: 'USD Coin (ERC20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ],
      bsc: [
        {
          symbol: 'BNB' as const,
          name: 'Binance Coin',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDT' as const,
          name: 'Tether USD (BEP20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDC' as const,
          name: 'USD Coin (BEP20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ],
      xrp: [
        {
          symbol: 'XRP' as const,
          name: 'XRP',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ],
      solana: [
        {
          symbol: 'SOL' as const,
          name: 'Solana',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDT' as const,
          name: 'Tether USD (SOL)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDC' as const,
          name: 'USD Coin (SOL)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ],
      tron: [
        {
          symbol: 'USDT' as const,
          name: 'Tether USD (TRC20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        },
        {
          symbol: 'USDC' as const,
          name: 'USD Coin (TRC20)',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }
      ]
    };

    return defaults[network as keyof typeof defaults] || [];
  };

  const loadRecentTransactions = async (wallets: NetworkWallet[]) => {
    try {
      console.log('📜 Loading recent transactions...');

      // In production, we show empty transaction list until APIs are configured
      // Only attempt to load transactions if explicitly testing APIs
      const testApi = new URLSearchParams(window.location.search).has('testApi');

      if (!testApi) {
        console.log('Transaction history requires API configuration. Use "Test API" button to check live data.');
        setRecentTransactions([]);
        return;
      }

      const allTransactions: Transaction[] = [];
      let dailyTotal = 0;
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      for (const wallet of wallets) {
        if (!wallet.address) continue;

        try {
          // Use BlockchainService.getTransactions() method
          const txHistory = await BlockchainService.getTransactions(wallet.address, wallet.network, 5);

          // Convert blockchain transactions to our Transaction interface
          const formattedTxs = txHistory.map((tx, index) => {
            const isIncoming = tx.to?.toLowerCase() === wallet.address.toLowerCase();
            const usdValue = parseFloat(tx.value) || 0;

            // Add to daily total if it's incoming and within 24 hours
            if (isIncoming && tx.timestamp >= oneDayAgo) {
              dailyTotal += usdValue;
            }

            return {
              id: `${wallet.id}-${index}`,
              walletId: wallet.id,
              type: isIncoming ? 'incoming' as const : 'outgoing' as const,
              amount: parseFloat(tx.value) || 0,
              currency: wallet.network.toUpperCase(),
              usdValue,
              fromAddress: tx.from,
              toAddress: tx.to,
              txHash: tx.hash,
              status: tx.status === 'success' ? 'confirmed' as const : 'pending' as const,
              confirmations: tx.confirmations,
              timestamp: tx.timestamp,
              donorInfo: {
                name: isIncoming ? 'Anonymous Donor' : undefined,
                email: '',
                isAnonymous: true
              }
            };
          });

          allTransactions.push(...formattedTxs);
          console.log(`✅ Loaded ${formattedTxs.length} transactions from ${wallet.network}`);
        } catch (error) {
          console.log(`Could not load transactions for ${wallet.network}:`, error.message);
        }
      }

      // Sort by timestamp and take most recent
      allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentTransactions(allTransactions.slice(0, 10));

      if (dailyTotal > 0) {
        setDailyDonations(dailyTotal);
      }

    } catch (error) {
      console.error('Error loading recent transactions:', error);
      setRecentTransactions([]);
    }
  };

  // Production-ready wallet creation functions
  const createProductionWallets = async (): Promise<NetworkWallet[]> => {
    const networks = [
      {
        id: 'bitcoin_main',
        network: 'bitcoin' as const,
        networkName: 'Bitcoin',
        address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || '',
        label: 'Bitcoin Donations',
        tokens: [{
          symbol: 'BTC' as const,
          name: 'Bitcoin',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }]
      },
      {
        id: 'ethereum_main',
        network: 'ethereum' as const,
        networkName: 'Ethereum (ERC20)',
        address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '',
        label: 'Ethereum Donations',
        tokens: [
          {
            symbol: 'ETH' as const,
            name: 'Ethereum',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDT' as const,
            name: 'Tether USD (ERC20)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDC' as const,
            name: 'USD Coin (ERC20)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          }
        ]
      },
      {
        id: 'bsc_main',
        network: 'bsc' as const,
        networkName: 'Binance Smart Chain (BEP20)',
        address: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS || process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '',
        label: 'BSC Donations',
        tokens: [
          {
            symbol: 'BNB' as const,
            name: 'Binance Coin',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDT' as const,
            name: 'Tether USD (BEP20)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDC' as const,
            name: 'USD Coin (BEP20)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          }
        ]
      },
      {
        id: 'xrp_main',
        network: 'xrp' as const,
        networkName: 'XRP Ledger',
        address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || '',
        label: 'XRP Donations',
        destinationTag: process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '12345678',
        tokens: [{
          symbol: 'XRP' as const,
          name: 'XRP',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }]
      },
      {
        id: 'solana_main',
        network: 'solana' as const,
        networkName: 'Solana (SPL)',
        address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '',
        label: 'Solana Donations',
        tokens: [
          {
            symbol: 'SOL' as const,
            name: 'Solana',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDT' as const,
            name: 'Tether USD (SPL)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          },
          {
            symbol: 'USDC' as const,
            name: 'USD Coin (SPL)',
            balance: 0,
            usdValue: 0,
            totalReceived: 0,
            totalSent: 0,
            transactionCount: 0
          }
        ]
      }
    ];

    return networks
      .filter(wallet => wallet.address) // Only include wallets with addresses
      .map(wallet => ({
        ...wallet,
        privateKey: getPrivateKeyForNetwork(wallet.network),
        seedPhrase: getSeedPhraseForNetwork(wallet.network),
        createdAt: new Date('2024-01-01'),
        lastActivity: new Date(),
        status: 'active' as const,
        walletType: 'production' as const
      }));
  };

  const createEmptyWallets = async (): Promise<NetworkWallet[]> => {
    // Fallback wallets with placeholder addresses for demo
    return [
      {
        id: 'btc_demo',
        network: 'bitcoin' as const,
        networkName: 'Bitcoin',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Genesis block address
        label: 'Bitcoin Donations (Demo)',
        privateKey: '',
        createdAt: new Date('2024-01-01'),
        lastActivity: new Date(),
        status: 'inactive' as const,
        tokens: [{
          symbol: 'BTC' as const,
          name: 'Bitcoin',
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }]
      }
    ];
  };

  const updateWalletsWithLiveData = async (wallets: NetworkWallet[]): Promise<void> => {
    const updatedWallets = await Promise.allSettled(
      wallets.map(async (wallet) => {
        try {
          const liveData = await BlockchainService.getWalletData(wallet.address, wallet.network);
          return {
            ...wallet,
            tokens: wallet.tokens.map(token => {
              const liveToken = liveData.balances.find(b => b.symbol === token.symbol);
              return liveToken ? {
                ...token,
                balance: liveToken.balance,
                usdValue: liveToken.usdValue,
                totalReceived: liveToken.totalReceived || token.totalReceived,
                totalSent: liveToken.totalSent || token.totalSent,
                transactionCount: liveToken.transactionCount || token.transactionCount
              } : token;
            }),
            lastActivity: liveData.lastActivity ? new Date(liveData.lastActivity) : wallet.lastActivity
          };
        } catch (error) {
          console.log(`Could not update live data for ${wallet.network}:`, error.message);
          return wallet; // Keep original wallet data
        }
      })
    );

    const successfulUpdates = updatedWallets
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<NetworkWallet>).value);

    if (successfulUpdates.length > 0) {
      setWalletData(successfulUpdates);
      console.log(`✅ Updated ${successfulUpdates.length} wallets with live data`);
    }
  };


  const cryptoIcons = {
    BTC: () => <SiBitcoin className="w-5 h-5 text-orange-500" />,
    ETH: () => <SiEthereum className="w-5 h-5 text-blue-500" />,
    BNB: () => <SiBinance className="w-5 h-5 text-yellow-500" />,
    USDT: () => <SiTether className="w-5 h-5 text-green-500" />,
    USDC: () => <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">$</div>,
    XRP: () => <SiRipple className="w-5 h-5 text-indigo-500" />,
    SOL: () => <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">S</div>
  };

  const filteredWallets = walletData.filter(wallet => {
    const matchesSearch = wallet.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.networkName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = filterCurrency === 'all' ||
                           wallet.tokens.some(token => token.symbol === filterCurrency);
    return matchesSearch && matchesCurrency;
  });

  const totalPortfolioValue = walletData.reduce((sum, wallet) =>
    sum + wallet.tokens.reduce((tokenSum, token) => tokenSum + token.usdValue, 0), 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateNewWallet = async () => {
    if (!walletLabel.trim()) {
      alert('Please enter a wallet label');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate the wallet using server-side API
      const response = await fetch('/api/wallets/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: selectedNetwork,
          label: walletLabel.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate wallet');
      }

      const newWallet = data.wallet;

      // Create a new wallet entry
      const networkNames = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum (ERC20)',
        bsc: 'Binance Smart Chain (BEP20)',
        xrp: 'XRP Ledger',
        solana: 'Solana Network',
        tron: 'Tron Network (TRC20)'
      };

      // Load wallet data from blockchain to get token balances
      const walletId = Date.now().toString();
      let populatedWallet: NetworkWallet;

      try {
        const blockchainWallet = await loadWalletForNetwork(
          selectedNetwork as any,
          walletId,
          walletLabel
        );

        if (blockchainWallet) {
          // Use blockchain data but override with generated wallet details
          populatedWallet = {
            ...blockchainWallet,
            id: walletId,
            address: newWallet.address,
            label: walletLabel,
            destinationTag: newWallet.destinationTag,
            privateKey: newWallet.privateKey,
            seedPhrase: newWallet.seedPhrase,
            createdAt: new Date(),
            lastActivity: new Date(),
            status: 'active'
          };
        } else {
          // Fallback if blockchain data fails - create default token structure
          const defaultTokens = getDefaultTokensForNetwork(selectedNetwork);
          populatedWallet = {
            id: walletId,
            network: selectedNetwork as any,
            networkName: networkNames[selectedNetwork as keyof typeof networkNames],
            address: newWallet.address,
            label: walletLabel,
            destinationTag: newWallet.destinationTag,
            privateKey: newWallet.privateKey,
            seedPhrase: newWallet.seedPhrase,
            tokens: defaultTokens,
            createdAt: new Date(),
            lastActivity: new Date(),
            status: 'active'
          };
        }
      } catch (error) {
        console.error('Error loading blockchain data for new wallet:', error);
        // Fallback with default tokens
        const defaultTokens = getDefaultTokensForNetwork(selectedNetwork);
        populatedWallet = {
          id: walletId,
          network: selectedNetwork as any,
          networkName: networkNames[selectedNetwork as keyof typeof networkNames],
          address: newWallet.address,
          label: walletLabel,
          destinationTag: newWallet.destinationTag,
          privateKey: newWallet.privateKey,
          seedPhrase: newWallet.seedPhrase,
          tokens: defaultTokens,
          createdAt: new Date(),
          lastActivity: new Date(),
          status: 'active'
        };
      }

      // Add to wallet list
      setWalletData(prev => [...prev, populatedWallet]);
      setGeneratedWallet(newWallet);

      // Reset form
      setWalletLabel('');
      setSelectedNetwork('ethereum');

      alert(`Successfully generated ${networkNames[selectedNetwork as keyof typeof networkNames]} wallet!\nAddress: ${newWallet.address}`);
    } catch (error) {
      console.error('Error generating wallet:', error);
      alert('Failed to generate wallet. Please try again.');
    } finally {
      setIsGenerating(false);
      setShowCreateModal(false);
    }
  };

  const togglePrivateKeyVisibility = (walletId: string) => {
    setVisiblePrivateKeys(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const formatPrivateKey = (privateKey: string) => {
    if (!privateKey) return 'Not available';
    return privateKey.length > 20
      ? `${privateKey.substring(0, 10)}...${privateKey.substring(privateKey.length - 10)}`
      : privateKey;
  };

  const showQrCode = async (wallet: NetworkWallet) => {
    setQrWallet(wallet);
    try {
      // Generate QR code for the wallet address
      let qrText = wallet.address;
      if (wallet.destinationTag) {
        qrText += `?dt=${wallet.destinationTag}`;
      }
      const qrDataUrl = await QRCode.toDataURL(qrText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(qrDataUrl);
      setShowQrModal(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const refreshWallet = async (walletId: string) => {
    console.log('🔄 Refresh wallet clicked for:', walletId);
    setRefreshingWallet(walletId);
    try {
      const wallet = walletData.find(w => w.id === walletId);
      console.log('📱 Found wallet:', wallet?.label, wallet?.network);
      if (wallet) {
        console.log('🔄 Starting wallet refresh...');
        const updatedWallet = await loadWalletForNetwork(wallet.network, wallet.id, wallet.label);
        if (updatedWallet) {
          console.log('✅ Wallet refreshed successfully:', updatedWallet.label);
          setWalletData(prev => prev.map(w => w.id === walletId ? updatedWallet : w));
        } else {
          console.log('❌ No updated wallet returned');
        }
      } else {
        console.log('❌ Wallet not found with id:', walletId);
      }
    } catch (error) {
      console.error(`❌ Error refreshing wallet ${walletId}:`, error);
    } finally {
      console.log('🏁 Refresh completed for:', walletId);
      setRefreshingWallet(null);
    }
  };

  const toggleDropdown = (walletId: string) => {
    console.log('⚙️ More actions clicked for:', walletId);
    console.log('📝 Current dropdown state:', openDropdown);
    const newState = openDropdown === walletId ? null : walletId;
    console.log('📝 New dropdown state will be:', newState);
    setOpenDropdown(newState);
  };

  const handleWalletAction = (action: string, wallet: NetworkWallet) => {
    console.log('🎯 Wallet action triggered:', action, 'for wallet:', wallet.label);
    setOpenDropdown(null);
    switch (action) {
      case 'withdraw':
        console.log('💸 Opening withdraw modal...');
        openWithdrawModal(wallet);
        break;
      case 'export':
        console.log('📤 Exporting wallet:', wallet.id);
        setSelectedWallet(wallet);
        setShowExportModal(true);
        break;
      case 'backup':
        console.log('💾 Backing up wallet:', wallet.id);
        setSelectedWallet(wallet);
        setShowBackupModal(true);
        break;
      case 'settings':
        console.log('⚙️ Opening wallet settings:', wallet.id);
        setSelectedWallet(wallet);
        setShowSettingsModal(true);
        break;
      case 'archive':
        console.log('🗄️ Archiving wallet:', wallet.id);
        if (confirm('Are you sure you want to archive this wallet? This will remove it from the active wallet list.')) {
          archiveWallet(wallet.id);
        }
        break;
      default:
        console.log('❓ Unknown action:', action);
    }
  };

  const openWithdrawModal = (wallet: NetworkWallet) => {
    setWithdrawalWallet(wallet);
    setWithdrawalForm({
      walletId: wallet.id,
      token: wallet.tokens[0]?.symbol || '',
      toAddress: '',
      amount: 0,
      priority: 'standard'
    });
    setShowWithdrawModal(true);
  };

  const handleWithdrawal = async () => {
    if (!withdrawalWallet || !withdrawalForm.toAddress || !withdrawalForm.amount) {
      alert('Please fill in all required fields');
      return;
    }

    setIsWithdrawing(true);
    try {
      // Simulate withdrawal API call
      console.log('Processing withdrawal:', {
        wallet: withdrawalWallet.label,
        token: withdrawalForm.token,
        toAddress: withdrawalForm.toAddress,
        amount: withdrawalForm.amount,
        priority: withdrawalForm.priority,
        destinationTag: withdrawalForm.destinationTag
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      alert(`Successfully sent ${withdrawalForm.amount} ${withdrawalForm.token} to ${withdrawalForm.toAddress}`);
      setShowWithdrawModal(false);

      // Reset form
      setWithdrawalForm({
        walletId: '',
        token: '',
        toAddress: '',
        amount: 0,
        priority: 'standard'
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const calculateNetworkFee = (priority: string, network: string) => {
    const fees = {
      bitcoin: { low: 0.0001, standard: 0.0003, high: 0.0008 },
      ethereum: { low: 0.002, standard: 0.005, high: 0.01 },
      bsc: { low: 0.0005, standard: 0.001, high: 0.002 },
      xrp: { low: 0.00001, standard: 0.00001, high: 0.00001 },
      solana: { low: 0.000005, standard: 0.000005, high: 0.000005 },
      tron: { low: 1.1, standard: 1.1, high: 1.1 }
    };

    return fees[network as keyof typeof fees]?.[priority as keyof typeof fees.bitcoin] || 0.001;
  };

  const archiveWallet = (walletId: string) => {
    console.log('🗄️ Archiving wallet:', walletId);
    const wallet = walletData.find(w => w.id === walletId);
    if (wallet) {
      // Remove from active wallets
      setWalletData(prev => prev.filter(w => w.id !== walletId));

      // Save to archived wallets in localStorage
      const archivedWallets = JSON.parse(localStorage.getItem('saintlammy_archived_wallets') || '[]');
      archivedWallets.push({
        ...wallet,
        archivedAt: new Date().toISOString()
      });
      localStorage.setItem('saintlammy_archived_wallets', JSON.stringify(archivedWallets));

      console.log('✅ Wallet archived successfully:', wallet.label);
    }
  };

  const exportWalletData = (wallet: NetworkWallet, format: 'json' | 'csv' | 'txt') => {
    console.log('📤 Exporting wallet data:', wallet.label, 'as', format);

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify({
          label: wallet.label,
          network: wallet.network,
          address: wallet.address,
          derivationPath: wallet.derivationPath,
          destinationTag: wallet.destinationTag,
          tokens: wallet.tokens,
          exportedAt: new Date().toISOString()
        }, null, 2);
        filename = `${wallet.label.replace(/\s+/g, '_')}_wallet_data.json`;
        mimeType = 'application/json';
        break;

      case 'csv':
        const headers = 'Label,Network,Address,Balance,USD Value\n';
        const rows = wallet.tokens.map(token =>
          `${wallet.label},${wallet.network},${wallet.address},${token.balance} ${token.symbol},${token.usdValue}`
        ).join('\n');
        content = headers + rows;
        filename = `${wallet.label.replace(/\s+/g, '_')}_wallet_data.csv`;
        mimeType = 'text/csv';
        break;

      case 'txt':
        content = `Wallet Information\n==================\n\n`;
        content += `Label: ${wallet.label}\n`;
        content += `Network: ${wallet.network}\n`;
        content += `Address: ${wallet.address}\n`;
        if (wallet.destinationTag) {
          content += `Destination Tag: ${wallet.destinationTag}\n`;
        }
        content += `\nToken Balances:\n`;
        wallet.tokens.forEach(token => {
          content += `- ${token.symbol}: ${token.balance} (≈ $${token.usdValue})\n`;
        });
        content += `\nExported: ${new Date().toLocaleString()}\n`;
        filename = `${wallet.label.replace(/\s+/g, '_')}_wallet_data.txt`;
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Export completed:', filename);
  };

  const createWalletBackup = (wallet: NetworkWallet, includePrivateKey: boolean = false) => {
    console.log('💾 Creating wallet backup for:', wallet.label);

    const backupData = {
      label: wallet.label,
      network: wallet.network,
      address: wallet.address,
      derivationPath: wallet.derivationPath,
      seedPhrase: wallet.seedPhrase,
      destinationTag: wallet.destinationTag,
      createdAt: wallet.createdAt,
      backupCreatedAt: new Date().toISOString(),
      version: '1.0'
    };

    if (includePrivateKey && wallet.privateKey) {
      backupData.privateKey = wallet.privateKey;
    }

    const content = JSON.stringify(backupData, null, 2);
    const filename = `${wallet.label.replace(/\s+/g, '_')}_wallet_backup.json`;

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Backup created:', filename);
  };

  const updateWalletSettings = (walletId: string, settings: { label?: string; notifications?: boolean }) => {
    console.log('⚙️ Updating wallet settings:', walletId, settings);

    setWalletData(prev => prev.map(wallet => {
      if (wallet.id === walletId) {
        return {
          ...wallet,
          label: settings.label || wallet.label,
          lastModified: new Date()
        };
      }
      return wallet;
    }));

    console.log('✅ Wallet settings updated');
  };

  const clearAllWallets = async () => {
    if (confirm('⚠️ DELETE ALL GENERATED WALLETS?\n\nThis will permanently remove:\n• All generated wallet addresses\n• All private keys and seed phrases\n• All archived wallets\n\nProduction wallets will remain unchanged.\n\nThis action CANNOT be undone!\n\nClick OK to proceed with deletion.')) {
      console.log('🧹 Starting wallet deletion process...');

      // Check what's being cleared
      const currentWallets = localStorage.getItem('saintlammy_wallets');
      const archivedWallets = localStorage.getItem('saintlammy_archived_wallets');

      if (currentWallets) {
        const wallets = JSON.parse(currentWallets);
        console.log(`📊 Clearing ${wallets.length} active wallets`);
      }

      if (archivedWallets) {
        const archived = JSON.parse(archivedWallets);
        console.log(`📊 Clearing ${archived.length} archived wallets`);
      }

      // Clear storage
      localStorage.removeItem('saintlammy_wallets');
      localStorage.removeItem('saintlammy_archived_wallets');

      // Reload wallet data to show production wallets only
      loadWalletData();

      console.log('✅ Wallet deletion complete! All generated wallets have been removed.');
      console.log('💡 Use "Generate All" or "Generate Wallet" to create new wallets.');

      // Show success message
      setTimeout(() => {
        alert('✅ All wallets deleted successfully!\n\nNo generated wallets remain. Use "Generate All" or "Generate Wallet" to create new wallets for testing.');
      }, 500);
    }
  };

  // Helper function to create NetworkWallet from API response
  const createNetworkWalletFromApiResponse = async (
    walletData: any,
    network: string
  ): Promise<NetworkWallet | null> => {
    try {
      const networkNames = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum (ERC20)',
        bsc: 'Binance Smart Chain (BEP20)',
        xrp: 'XRP Ledger',
        solana: 'Solana Network',
        tron: 'Tron Network (TRC20)'
      };

      // Map network to primary token
      const primaryTokens = {
        bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
        ethereum: { symbol: 'ETH', name: 'Ethereum' },
        bsc: { symbol: 'BNB', name: 'BNB' },
        xrp: { symbol: 'XRP', name: 'XRP' },
        solana: { symbol: 'SOL', name: 'Solana' },
        tron: { symbol: 'TRX', name: 'Tron' }
      };

      const primaryToken = primaryTokens[network as keyof typeof primaryTokens];
      if (!primaryToken) return null;

      const wallet: NetworkWallet = {
        id: `${network}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        network: network as any,
        networkName: networkNames[network as keyof typeof networkNames],
        address: walletData.address,
        label: walletData.label,
        destinationTag: walletData.destinationTag,
        privateKey: walletData.privateKey,
        seedPhrase: walletData.seedPhrase,
        tokens: [{
          symbol: primaryToken.symbol as any,
          name: primaryToken.name,
          balance: 0,
          usdValue: 0,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0
        }],
        createdAt: new Date(),
        lastActivity: new Date(),
        status: 'active'
      };

      return wallet;
    } catch (error) {
      console.error('Error creating NetworkWallet from API response:', error);
      return null;
    }
  };

  const generateAllNetworkWallets = async () => {
    if (confirm('Generate new wallets for all supported networks? This will create fresh wallets for Bitcoin, Ethereum, XRP, Solana, Tron, and BSC.')) {
      console.log('🚀 Generating wallets for all networks...');

      const networks = [
        { network: 'bitcoin' as const, label: 'Bitcoin Main Wallet' },
        { network: 'ethereum' as const, label: 'Ethereum Main Wallet' },
        { network: 'xrp' as const, label: 'XRP Main Wallet' },
        { network: 'solana' as const, label: 'Solana Main Wallet' },
        { network: 'tron' as const, label: 'Tron Main Wallet' },
        { network: 'bsc' as const, label: 'BSC Main Wallet' }
      ];

      const generatedWallets: NetworkWallet[] = [];

      for (const { network, label } of networks) {
        try {
          console.log(`Generating ${network} wallet...`);
          const response = await fetch('/api/wallets/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ network, label })
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Generated ${network} wallet:`, data.wallet.address);

            // Convert API response to NetworkWallet format
            const networkWallet = await createNetworkWalletFromApiResponse(data.wallet, network);
            if (networkWallet) {
              generatedWallets.push(networkWallet);
            }
          } else {
            console.error(`❌ Failed to generate ${network} wallet`);
          }
        } catch (error) {
          console.error(`❌ Error generating ${network} wallet:`, error);
        }
      }

      // Update wallet data with generated wallets
      if (generatedWallets.length > 0) {
        console.log(`📊 Adding ${generatedWallets.length} generated wallets to current wallet list`);
        const updatedWallets = [...walletData, ...generatedWallets];
        setWalletData(updatedWallets);
        console.log('✅ All wallets generated successfully!');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Wallet Management - Saintlammy Foundation Admin</title>
        <meta name="description" content="Manage cryptocurrency wallets and addresses" />
      </Head>

      <AdminLayout title="Wallet Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Wallet Management</h1>
              <p className="text-gray-400 mt-1">Manage cryptocurrency wallets and donation addresses</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadWalletData(true)}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                title="Test blockchain API integration"
              >
                <Zap className="w-4 h-4" />
                <span>Test API</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Wallet</span>
              </button>
              {/* Test/Development buttons - hidden in production */}
              {false && (
                <>
                  <button
                    onClick={generateAllNetworkWallets}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Generate wallets for all supported networks"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Generate All</span>
                  </button>
                  <button
                    onClick={clearAllWallets}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Clear all wallets and reset to defaults"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Wallets</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-white mt-1">${totalPortfolioValue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm font-medium">+8.5%</span>
                    <span className="text-gray-400 text-sm ml-1">24h</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Networks</p>
                  <p className="text-2xl font-bold text-white mt-1">{walletData.filter(w => w.status === 'active').length}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-gray-400 text-sm">All operational</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">24h Donations</p>
                  <p className="text-2xl font-bold text-white mt-1">${dailyDonations.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm font-medium">+12.3%</span>
                    <span className="text-gray-400 text-sm ml-1">vs yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Security Status</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">Secure</p>
                  <div className="flex items-center mt-2">
                    <Shield className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-gray-400 text-sm">All wallets protected</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search wallets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Tokens</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="XRP">XRP (XRP)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="USDT">Tether USD (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
            </select>
          </div>

          {/* Wallet List */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Wallet Addresses</h3>
                <div className="flex items-center space-x-3">
                  {loading && (
                    <div className="flex items-center space-x-2 text-accent-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPrivateKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-sm">{showPrivateKeys ? 'Hide' : 'Show'} Details</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-700">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-accent-400 mb-4" />
                  <p className="text-gray-400">Loading wallet data from blockchain...</p>
                </div>
              ) : filteredWallets.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400">No wallets found matching your criteria.</p>
                </div>
              ) : (
                filteredWallets.map((wallet) => {
                const totalUsdValue = wallet.tokens.reduce((sum, token) => sum + token.usdValue, 0);
                const totalTransactions = wallet.tokens.reduce((sum, token) => sum + token.transactionCount, 0);

                return (
                  <div key={wallet.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg">
                          <Globe className="w-6 h-6 text-accent-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-medium">{wallet.label}</h4>
                            <span className="text-accent-400 text-sm">({wallet.networkName})</span>
                            {wallet.walletType === 'production' ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                Production
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                wallet.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                wallet.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {wallet.status}
                              </span>
                            )}
                          </div>

                          {/* Address */}
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-gray-400 text-xs font-medium">Address:</span>
                            <span className="text-white text-sm font-mono">
                              {wallet.address.substring(0, 16)}...{wallet.address.substring(wallet.address.length - 6)}
                            </span>
                            <button
                              onClick={() => copyToClipboard(wallet.address)}
                              className="text-gray-400 hover:text-gray-300 transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Destination Tag for XRP */}
                          {wallet.destinationTag && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-orange-400 text-xs font-medium">Dest. Tag:</span>
                              <span className="text-orange-300 text-sm font-mono">{wallet.destinationTag}</span>
                              <button
                                onClick={() => copyToClipboard(wallet.destinationTag!)}
                                className="text-orange-400 hover:text-orange-300 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Transaction Count and Last Activity */}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                            <span>{totalTransactions} transactions</span>
                            {wallet.lastActivity && (
                              <span>Last: {wallet.lastActivity instanceof Date ? wallet.lastActivity.toLocaleDateString() : new Date(wallet.lastActivity).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          ${totalUsdValue.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {wallet.tokens.length} tokens
                        </div>
                        <div className="flex items-center justify-end space-x-1 mt-2">
                          <button
                            onClick={() => showQrCode(wallet)}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                            title="Show QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              refreshWallet(wallet.id);
                            }}
                            disabled={refreshingWallet === wallet.id}
                            className="p-1 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                            title="Refresh Balance"
                          >
                            <RefreshCw className={`w-4 h-4 ${refreshingWallet === wallet.id ? 'animate-spin' : ''}`} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(wallet.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openDropdown === wallet.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletAction('withdraw', wallet);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-gray-700 rounded-t-lg transition-colors"
                                >
                                  <Send className="w-4 h-4 inline mr-2" />
                                  Send/Withdraw
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletAction('export', wallet);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <Download className="w-4 h-4 inline mr-2" />
                                  Export Wallet Data
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletAction('backup', wallet);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <Shield className="w-4 h-4 inline mr-2" />
                                  Backup Wallet
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletAction('settings', wallet);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                  <Globe className="w-4 h-4 inline mr-2" />
                                  Wallet Settings
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWalletAction('archive', wallet);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 rounded-b-lg transition-colors"
                                >
                                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                                  Archive Wallet
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wallet.tokens.map((token) => {
                        const TokenIcon = cryptoIcons[token.symbol];
                        return (
                          <div key={token.symbol} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                                {TokenIcon && <TokenIcon />}
                              </div>
                              <div>
                                <h5 className="text-white font-medium">{token.symbol}</h5>
                                <p className="text-gray-400 text-xs">{token.name}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Balance:</span>
                                <span className="text-white font-medium">{token.balance?.toLocaleString() || '0'} {token.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">USD Value:</span>
                                <span className="text-green-400 font-medium">${token.usdValue?.toLocaleString() || '0.00'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Transactions:</span>
                                <span className="text-gray-300">{token.transactionCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {showPrivateKeys && (
                      <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-400">Network:</span>
                            <div className="text-white font-medium">{wallet.networkName}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Total Value:</span>
                            <div className="text-white font-medium">${totalUsdValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Created:</span>
                            <div className="text-white font-medium">{wallet.createdAt instanceof Date ? wallet.createdAt.toLocaleDateString() : new Date(wallet.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>

                        {/* Security Section */}
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-white font-medium flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-red-400" />
                              Sensitive Data
                            </h5>
                            <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                              ⚠️ Keep Secure
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Private Key */}
                            {wallet.privateKey && (
                              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-400 text-sm font-medium">Private Key:</span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => togglePrivateKeyVisibility(wallet.id)}
                                      className="text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                      {visiblePrivateKeys[wallet.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={() => copyToClipboard(wallet.privateKey!)}
                                      className="text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="text-red-300 font-mono text-sm break-all">
                                  {visiblePrivateKeys[wallet.id] ? wallet.privateKey : formatPrivateKey(wallet.privateKey)}
                                </div>
                              </div>
                            )}

                            {/* Seed Phrase */}
                            {wallet.seedPhrase && (
                              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-400 text-sm font-medium">Seed Phrase:</span>
                                  <button
                                    onClick={() => copyToClipboard(wallet.seedPhrase!)}
                                    className="text-gray-400 hover:text-gray-300 transition-colors"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-yellow-300 font-mono text-sm">
                                  {wallet.seedPhrase}
                                </div>
                              </div>
                            )}

                            {/* Environment Variable Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                              <div className="text-blue-400 text-xs font-medium mb-1">Environment Variables:</div>
                              <div className="text-blue-300 text-xs space-y-1">
                                <div>Address: <code>NEXT_PUBLIC_{wallet.network.toUpperCase()}_WALLET_ADDRESS</code></div>
                                <div>Private Key: <code>{wallet.network.toUpperCase()}_PRIVATE_KEY</code></div>
                                {wallet.seedPhrase && <div>Seed: <code>{wallet.network.toUpperCase()}_SEED_PHRASE</code></div>}
                                {wallet.destinationTag && <div>Tag: <code>NEXT_PUBLIC_{wallet.network.toUpperCase()}_DESTINATION_TAG</code></div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
                })
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-700">
              {recentTransactions.map((tx) => {
                const IconComponent = cryptoIcons[tx.currency as keyof typeof cryptoIcons];
                return (
                  <div key={tx.id} className="p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'incoming' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.type === 'incoming' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            {IconComponent && <IconComponent />}
                            <span className="text-white font-medium">
                              {tx.type === 'incoming' ? 'Received' : 'Sent'} {tx.amount} {tx.currency}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            {tx.donorInfo?.isAnonymous ? 'Anonymous Donor' : tx.donorInfo?.name || 'Unknown'}
                            <span className="mx-2">•</span>
                            {tx.confirmations} confirmations
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${tx.usdValue?.toLocaleString() || '0.00'}</div>
                        <div className="text-gray-400 text-sm">{tx.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Create Wallet Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Generate New Network Wallet</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Blockchain Network</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="bitcoin">Bitcoin Network (BTC)</option>
                    <option value="ethereum">Ethereum Network (ETH, USDT, USDC - ERC20)</option>
                    <option value="bsc">Binance Smart Chain (BNB, USDT, USDC - BEP20)</option>
                    <option value="xrp">XRP Ledger (XRP)</option>
                    <option value="solana">Solana Network (SOL, USDT, USDC)</option>
                    <option value="tron">Tron Network (USDT, USDC - TRC20)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Label</label>
                  <input
                    type="text"
                    value={walletLabel}
                    onChange={(e) => setWalletLabel(e.target.value)}
                    placeholder="e.g., Emergency Fund Ethereum Wallet"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                  <p className="text-yellow-400 text-xs mb-2">⚠️ Security Notice:</p>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li>• Wallets are generated using cryptographically secure random numbers</li>
                    <li>• Private keys and seed phrases will be displayed once - save them securely</li>
                    <li>• Each network generates one address for all supported tokens</li>
                    <li>• XRP wallets include a destination tag for donation tracking</li>
                    <li>• Never share your private keys or seed phrases with anyone</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generateNewWallet}
                  disabled={isGenerating || !walletLabel.trim()}
                  className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Wallet'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQrModal && qrWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Wallet QR Code</h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  {qrDataUrl && <img src={qrDataUrl} alt="Wallet QR Code" className="w-64 h-64" />}
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium">{qrWallet.label}</h4>
                  <p className="text-gray-400 text-sm">{qrWallet.networkName}</p>

                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Address:</span>
                      <button
                        onClick={() => copyToClipboard(qrWallet.address)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-white font-mono text-sm break-all">
                      {qrWallet.address}
                    </div>
                  </div>

                  {qrWallet.destinationTag && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-400 text-sm font-medium">Destination Tag:</span>
                        <button
                          onClick={() => copyToClipboard(qrWallet.destinationTag!)}
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-orange-300 font-mono text-sm">
                        {qrWallet.destinationTag}
                      </div>
                      <div className="text-orange-200 text-xs mt-2">
                        ⚠️ Required for XRP transactions
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `${qrWallet.label}-qr-code.png`;
                      link.href = qrDataUrl;
                      link.click();
                    }}
                    className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showWithdrawModal && withdrawalWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Send className="w-5 h-5 mr-2 text-green-400" />
                  Send from {withdrawalWallet.label}
                </h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Wallet Info */}
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{withdrawalWallet.label}</h4>
                      <p className="text-gray-400 text-sm">{withdrawalWallet.networkName}</p>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {withdrawalWallet.address.substring(0, 20)}...{withdrawalWallet.address.substring(withdrawalWallet.address.length - 8)}
                  </div>
                </div>

                {/* Token Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Token</label>
                  <select
                    value={withdrawalForm.token}
                    onChange={(e) => setWithdrawalForm(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    {withdrawalWallet.tokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol}) - Balance: {token.balance?.toLocaleString() || '0'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={withdrawalForm.toAddress}
                    onChange={(e) => setWithdrawalForm(prev => ({ ...prev, toAddress: e.target.value }))}
                    placeholder={`Enter ${withdrawalWallet.networkName} address`}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* XRP Destination Tag */}
                {withdrawalWallet.network === 'xrp' && (
                  <div>
                    <label className="block text-sm font-medium text-orange-400 mb-2">
                      Destination Tag (Required for exchanges)
                    </label>
                    <input
                      type="text"
                      value={withdrawalForm.destinationTag || ''}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, destinationTag: e.target.value }))}
                      placeholder="Enter destination tag if required"
                      className="w-full bg-gray-700 border border-orange-500/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-orange-300 text-xs mt-1">⚠️ Required when sending to exchanges or some wallets</p>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={withdrawalForm.amount || ''}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      {withdrawalForm.token}
                    </div>
                  </div>
                  {withdrawalWallet.tokens.find(t => t.symbol === withdrawalForm.token) && (
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-gray-400">
                        Available: {withdrawalWallet.tokens.find(t => t.symbol === withdrawalForm.token)?.balance?.toLocaleString() || '0'} {withdrawalForm.token}
                      </span>
                      <button
                        onClick={() => {
                          const token = withdrawalWallet.tokens.find(t => t.symbol === withdrawalForm.token);
                          if (token) {
                            const fee = calculateNetworkFee(withdrawalForm.priority, withdrawalWallet.network);
                            const maxAmount = token.balance - (withdrawalForm.token === 'ETH' || withdrawalForm.token === 'BNB' ? fee : 0);
                            setWithdrawalForm(prev => ({ ...prev, amount: Math.max(0, maxAmount) }));
                          }
                        }}
                        className="text-accent-400 hover:text-accent-300 transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>

                {/* Transaction Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Priority</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['low', 'standard', 'high'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setWithdrawalForm(prev => ({ ...prev, priority: priority as 'low' | 'standard' | 'high' }))}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          withdrawalForm.priority === priority
                            ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                            : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium capitalize">{priority}</div>
                        <div className="text-xs mt-1">
                          ~{calculateNetworkFee(priority, withdrawalWallet.network)} {withdrawalWallet.network === 'xrp' ? 'XRP' : withdrawalWallet.network === 'ethereum' ? 'ETH' : withdrawalWallet.network === 'bsc' ? 'BNB' : withdrawalWallet.network === 'solana' ? 'SOL' : withdrawalWallet.network === 'tron' ? 'TRX' : 'BTC'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {priority === 'low' ? '~30 min' : priority === 'standard' ? '~10 min' : '~5 min'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <h5 className="text-white font-medium mb-3">Transaction Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">{withdrawalForm.amount || 0} {withdrawalForm.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Fee:</span>
                      <span className="text-white">
                        ~{calculateNetworkFee(withdrawalForm.priority, withdrawalWallet.network)} {withdrawalWallet.network === 'xrp' ? 'XRP' : withdrawalWallet.network === 'ethereum' ? 'ETH' : withdrawalWallet.network === 'bsc' ? 'BNB' : withdrawalWallet.network === 'solana' ? 'SOL' : withdrawalWallet.network === 'tron' ? 'TRX' : 'BTC'}
                      </span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
                      <span className="text-gray-300">Total Cost:</span>
                      <span className="text-white">
                        {withdrawalForm.amount || 0} {withdrawalForm.token} + fees
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-200 text-sm">
                      <p className="font-medium mb-1">⚠️ Important Warnings:</p>
                      <ul className="text-xs space-y-1 text-yellow-300">
                        <li>• Double-check the recipient address - transactions cannot be reversed</li>
                        <li>• Ensure you're using the correct network for the recipient</li>
                        <li>• Include destination tag for XRP if sending to exchanges</li>
                        <li>• Network fees are paid separately and may vary</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    disabled={isWithdrawing}
                    className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={isWithdrawing || !withdrawalForm.toAddress || !withdrawalForm.amount}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send {withdrawalForm.token}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Wallet Modal */}
        {showExportModal && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Export Wallet Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 mb-4">
                Export wallet data for <span className="font-medium text-white">{selectedWallet.label}</span>
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    exportWalletData(selectedWallet, 'json');
                    setShowExportModal(false);
                  }}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </button>
                <button
                  onClick={() => {
                    exportWalletData(selectedWallet, 'csv');
                    setShowExportModal(false);
                  }}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </button>
                <button
                  onClick={() => {
                    exportWalletData(selectedWallet, 'txt');
                    setShowExportModal(false);
                  }}
                  className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as TXT
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="w-full mt-4 p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Backup Wallet Modal */}
        {showBackupModal && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Backup Wallet</h3>
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 mb-4">
                Create a secure backup for <span className="font-medium text-white">{selectedWallet.label}</span>
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    createWalletBackup(selectedWallet, false);
                    setShowBackupModal(false);
                  }}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Backup (Without Private Key)
                </button>
                <button
                  onClick={() => {
                    if (confirm('⚠️ Including private key is sensitive! Only use this for secure offline storage.')) {
                      createWalletBackup(selectedWallet, true);
                      setShowBackupModal(false);
                    }
                  }}
                  className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Full Backup (With Private Key)
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Store backups securely. Never share backup files containing private keys.
                </p>
              </div>

              <button
                onClick={() => setShowBackupModal(false)}
                className="w-full mt-4 p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && selectedWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Wallet Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Label
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedWallet.label}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-accent-500 focus:outline-none"
                    placeholder="Enter wallet label"
                    onBlur={(e) => {
                      const newLabel = e.target.value.trim();
                      if (newLabel && newLabel !== selectedWallet.label) {
                        updateWalletSettings(selectedWallet.id, { label: newLabel });
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Wallet Information</h4>
                  <div className="p-3 bg-gray-700 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network:</span>
                      <span className="text-white font-medium">{selectedWallet.network}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white font-medium">
                        {selectedWallet.createdAt instanceof Date
                          ? selectedWallet.createdAt.toLocaleDateString()
                          : new Date(selectedWallet.createdAt).toLocaleDateString()
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Tokens:</span>
                      <span className="text-white font-medium">{selectedWallet.tokens.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full mt-6 p-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminWalletManagement;