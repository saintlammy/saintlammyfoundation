import React, { useState, useEffect } from 'react';
import { Heart, Shield, TrendingUp, Copy, CheckCircle, CreditCard, Bitcoin, Banknote, Globe, ChevronDown, ExternalLink, X } from 'lucide-react';
import { SiBitcoin, SiEthereum, SiTether, SiRipple } from 'react-icons/si';
import { walletManager } from '@/lib/wallet';
import { DonationContext } from './DonationModalProvider';

type CryptoCurrencyKey = 'btc' | 'eth' | 'usdc' | 'usdt' | 'xrp';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: DonationContext | null;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, context }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [donationType, setDonationType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [cryptoFormData, setCryptoFormData] = useState({ name: '', email: '', transactionHash: '' });
  const [copiedAddress, setCopiedAddress] = useState('');
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  const currencies = {
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    NGN: { symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' }
  };

  const presetAmounts = {
    USD: [25, 50, 100, 250, 500, 1000],
    NGN: [10000, 20000, 40000, 100000, 200000, 400000]
  };

  // Initialize values based on context
  useEffect(() => {
    if (context && isOpen) {
      if (context.amount) {
        setDonationAmount(context.amount.toString());
      }
      if (context.preferredMethod) {
        setPaymentMethod(context.preferredMethod);
        if (context.preferredMethod === 'crypto') {
          // Pre-select Bitcoin for crypto donations
          setSelectedCrypto('btc');
        }
      }
    }
  }, [context, isOpen]);

  const cryptoCurrencies = {
    btc: {
      name: 'Bitcoin (BTC)',
      symbol: 'BTC',
      icon: SiBitcoin,
      color: 'from-orange-500 to-orange-600',
      networks: {
        bitcoin: {
          name: 'Bitcoin Network',
          address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          explorer: 'https://blockstream.info/tx/'
        }
      }
    },
    eth: {
      name: 'Ethereum (ETH)',
      symbol: 'ETH',
      icon: SiEthereum,
      color: 'from-blue-500 to-blue-600',
      networks: {
        erc20: {
          name: 'Ethereum (ERC20)',
          address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://etherscan.io/tx/'
        }
      }
    },
    usdc: {
      name: 'USD Coin (USDC)',
      symbol: 'USDC',
      icon: () => <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>,
      color: 'from-blue-400 to-blue-500',
      networks: {
        sol: {
          name: 'Solana',
          address: process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS || 'GKvqsuNcnwWqPzzuhLmGi4rzzh55FhJtGizkhHadjqMX',
          explorer: 'https://explorer.solana.com/tx/'
        },
        erc20: {
          name: 'Ethereum (ERC20)',
          address: process.env.NEXT_PUBLIC_USDC_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://etherscan.io/tx/'
        },
        bep20: {
          name: 'BSC (BEP20)',
          address: process.env.NEXT_PUBLIC_USDC_BSC_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://bscscan.com/tx/'
        },
        trc20: {
          name: 'Tron (TRC20)',
          address: process.env.NEXT_PUBLIC_USDC_TRC_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
          explorer: 'https://tronscan.org/#/transaction/'
        }
      }
    },
    usdt: {
      name: 'Tether (USDT)',
      symbol: 'USDT',
      icon: SiTether,
      color: 'from-green-500 to-green-600',
      networks: {
        sol: {
          name: 'Solana',
          address: process.env.NEXT_PUBLIC_USDT_SOL_ADDRESS || 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          explorer: 'https://explorer.solana.com/tx/'
        },
        erc20: {
          name: 'Ethereum (ERC20)',
          address: process.env.NEXT_PUBLIC_USDT_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://etherscan.io/tx/'
        },
        bep20: {
          name: 'BSC (BEP20)',
          address: process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://bscscan.com/tx/'
        },
        trc20: {
          name: 'Tron (TRC20)',
          address: process.env.NEXT_PUBLIC_USDT_TRC_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
          explorer: 'https://tronscan.org/#/transaction/'
        }
      }
    },
    sol: {
      name: 'Solana (SOL)',
      symbol: 'SOL',
      icon: () => <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>,
      color: 'from-purple-500 to-purple-600',
      networks: {
        sol: {
          name: 'Solana Network',
          address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '11111111111111111111111111111111',
          explorer: 'https://explorer.solana.com/tx/'
        }
      }
    },
    bnb: {
      name: 'BNB (BNB)',
      symbol: 'BNB',
      icon: () => <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>,
      color: 'from-yellow-500 to-yellow-600',
      networks: {
        bep20: {
          name: 'BSC (BEP20)',
          address: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
          explorer: 'https://bscscan.com/tx/'
        }
      }
    },
    trx: {
      name: 'Tron (TRX)',
      symbol: 'TRX',
      icon: () => <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>,
      color: 'from-red-500 to-red-600',
      networks: {
        trc20: {
          name: 'Tron Network (TRC20)',
          address: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
          explorer: 'https://tronscan.org/#/transaction/'
        }
      }
    },
    xrp: {
      name: 'XRP (XRP)',
      symbol: 'XRP',
      icon: SiRipple,
      color: 'from-indigo-500 to-indigo-600',
      networks: {
        xrpl: {
          name: 'XRP Ledger',
          address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy',
          explorer: 'https://xrpscan.com/tx/',
          memo: `Tag: ${process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '12345678'}`
        }
      }
    }
  };

  const donationMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      description: 'Secure payment with Visa, Mastercard, or Verve',
      icon: CreditCard,
      fees: '2.9% + ₦50'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Direct bank transfer (Nigerian banks)',
      icon: Banknote,
      fees: 'No fees'
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      description: 'Bitcoin, Ethereum, USDT, and more',
      icon: Bitcoin,
      fees: 'Network fees only'
    },
    {
      id: 'international',
      title: 'International',
      description: 'PayPal, Stripe, Wise for international donors',
      icon: Globe,
      fees: '3.4% + fees'
    }
  ];

  const bankDetails = {
    accountName: 'Saintlammy Community Care Initiative',
    accountNumber: '0123456789',
    bankName: 'First Bank of Nigeria',
    sortCode: '011-152-003'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const handleCryptoSelect = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setSelectedNetwork('');
    setNetworkDropdownOpen(false);
  };

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
    setNetworkDropdownOpen(false);
  };

  const handleCryptoFormChange = (field: string, value: string) => {
    setCryptoFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentCryptoAddress = () => {
    if (!selectedCrypto || !selectedNetwork) return '';

    // Try to get address from wallet manager first
    const dynamicAddress = walletManager.getDonationAddress(selectedCrypto.toUpperCase(), selectedNetwork);
    if (dynamicAddress) {
      return dynamicAddress;
    }

    // Fallback to static addresses
    const crypto = cryptoCurrencies[selectedCrypto as CryptoCurrencyKey];
    return (crypto?.networks as any)?.[selectedNetwork]?.address || '';
  };

  const getCurrentNetworkExplorer = () => {
    if (!selectedCrypto || !selectedNetwork) return '';
    const crypto = cryptoCurrencies[selectedCrypto as CryptoCurrencyKey];
    return (crypto?.networks as any)?.[selectedNetwork]?.explorer || '';
  };

  const getCurrentMemo = () => {
    if (!selectedCrypto || !selectedNetwork) return '';

    // Try to get memo from wallet manager first
    const dynamicMemo = walletManager.getDonationMemo(selectedCrypto.toUpperCase(), selectedNetwork);
    if (dynamicMemo) {
      return dynamicMemo;
    }

    // Fallback to static memo
    const crypto = cryptoCurrencies[selectedCrypto as CryptoCurrencyKey];
    return (crypto?.networks as any)?.[selectedNetwork]?.memo || '';
  };

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString());
  };

  const getCurrencySymbol = () => currencies[selectedCurrency as keyof typeof currencies].symbol;
  const getCurrentPresetAmounts = () => presetAmounts[selectedCurrency as keyof typeof presetAmounts];

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencies[currency as keyof typeof currencies].symbol;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleDonation = () => {
    // Track donation with context for analytics
    const donationData = {
      amount: parseFloat(donationAmount) || 0,
      currency: selectedCurrency,
      type: donationType,
      paymentMethod,
      timestamp: new Date().toISOString(),
      context: context || null,
      source: context?.source || 'general',
      category: context?.category || null,
      ...(paymentMethod === 'crypto' && {
        cryptocurrency: selectedCrypto,
        network: selectedNetwork,
        address: getCurrentCryptoAddress(),
        formData: cryptoFormData
      })
    };

    // Log for analytics (in production, send to analytics service)
    console.log('Donation initiated:', donationData);

    // In production, you would send this to your analytics service:
    // analytics.track('donation_initiated', donationData);
    // or send to your backend API for processing

    // TODO: Implement actual payment processing based on method
    if (paymentMethod === 'card') {
      // Process card payment
      console.log('Processing card payment...', donationData);
    } else if (paymentMethod === 'crypto') {
      // Process crypto donation tracking
      console.log('Tracking crypto donation...', donationData);
    } else if (paymentMethod === 'bank') {
      // Process bank transfer confirmation
      console.log('Bank transfer details provided...', donationData);
    } else if (paymentMethod === 'international') {
      // Handle international donation contact
      console.log('International donation contact...', donationData);
    }

    // For now, just show success message
    alert(`Donation of ${formatAmount(parseFloat(donationAmount), selectedCurrency)} initiated successfully! Source: ${donationData.source}`);
    onClose();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between rounded-t-3xl">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white font-display">
                {context?.title || 'Make a Donation'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-light">
                {context?.description || 'Your generosity transforms lives'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`p-4 rounded-xl border-2 transition-colors text-center ${
                    donationType === 'one-time'
                      ? 'border-accent-500 bg-accent-500/10 text-gray-900 dark:text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">One-time</div>
                  <div className="text-sm opacity-75">Make a single donation</div>
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`p-4 rounded-xl border-2 transition-colors text-center ${
                    donationType === 'monthly'
                      ? 'border-accent-500 bg-accent-500/10 text-gray-900 dark:text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">Monthly</div>
                  <div className="text-sm opacity-75">Recurring donation</div>
                </button>
              </div>
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(currencies).map(([code, currency]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedCurrency(code);
                      setDonationAmount(''); // Reset amount when changing currency
                    }}
                    className={`p-4 rounded-xl border-2 transition-colors text-left ${
                      selectedCurrency === code
                        ? 'border-accent-500 bg-accent-500/10 text-gray-900 dark:text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <div className="font-semibold">{currency.symbol} {code}</div>
                        <div className="text-sm opacity-75">{currency.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Donation Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Amount ({selectedCurrency})
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {getCurrentPresetAmounts().map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-3 rounded-lg border transition-colors ${
                      donationAmount === amount.toString()
                        ? 'border-accent-500 bg-accent-500/10 text-gray-900 dark:text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    {formatAmount(amount, selectedCurrency)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donationMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-colors text-left ${
                      paymentMethod === method.id
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <method.icon className="w-5 h-5 text-accent-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{method.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{method.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fees: {method.fees}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details Based on Method */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credit/Debit Card Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bank Transfer Details</h3>
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Account Name:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white font-medium">{bankDetails.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                        className="text-accent-400 hover:text-accent-300 transition-colors"
                      >
                        {copiedAddress === 'account' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Bank:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Sort Code:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{bankDetails.sortCode}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please send us the transfer receipt at hello@saintlammyfoundation.org
                </p>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cryptocurrency Donation</h3>

                {/* Cryptocurrency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Cryptocurrency
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(cryptoCurrencies).map(([cryptoId, crypto]) => {
                      const IconComponent = crypto.icon;
                      return (
                        <button
                          key={cryptoId}
                          onClick={() => handleCryptoSelect(cryptoId)}
                          className={`p-4 rounded-lg border transition-colors text-center group ${
                            selectedCrypto === cryptoId
                              ? 'border-accent-500 bg-accent-500/10 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${crypto.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs font-medium">{crypto.symbol}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Network Selection */}
                {selectedCrypto && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Network
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        <span>
                          {selectedNetwork
                            ? (cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks as any)?.[selectedNetwork]?.name
                            : 'Choose a network...'}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${
                          networkDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {networkDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden z-10 shadow-lg">
                          {Object.entries(cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks || {}).map(([networkId, network]) => (
                            <button
                              key={networkId}
                              onClick={() => handleNetworkSelect(networkId)}
                              className="w-full p-4 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                            >
                              {(network as any).name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Wallet Address Display */}
                {selectedCrypto && selectedNetwork && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.name} Address ({(cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks as any)?.[selectedNetwork]?.name}):
                      </span>
                      <button
                        onClick={() => copyToClipboard(getCurrentCryptoAddress(), 'address')}
                        className="text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-2"
                      >
                        {copiedAddress === 'address' ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white break-all">
                      {getCurrentCryptoAddress()}
                    </div>

                    {getCurrentMemo() && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 font-medium">Memo/Tag (Required):</span>
                          <button
                            onClick={() => copyToClipboard(getCurrentMemo(), 'memo')}
                            className="text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-2"
                          >
                            {copiedAddress === 'memo' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-white">
                          {getCurrentMemo()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Donor Information Form */}
                {selectedCrypto && selectedNetwork && (
                  <div className="bg-gray-700/30 rounded-xl p-6 space-y-4">
                    <h4 className="text-white font-semibold mb-4">Donor Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={cryptoFormData.name}
                        onChange={(e) => handleCryptoFormChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={cryptoFormData.email}
                        onChange={(e) => handleCryptoFormChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Transaction Hash (after sending)"
                      value={cryptoFormData.transactionHash}
                      onChange={(e) => handleCryptoFormChange('transactionHash', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                    />

                    {cryptoFormData.transactionHash && getCurrentNetworkExplorer() && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-accent-400" />
                        <a
                          href={`${getCurrentNetworkExplorer()}${cryptoFormData.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          View transaction on blockchain explorer
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {selectedCrypto && selectedNetwork && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="text-white font-medium">Blockchain Traceability & Dynamic Wallets</p>
                        <p className="text-gray-300">
                          All cryptocurrency donations are fully traceable on the blockchain. This address is dynamically generated and managed through our secure wallet system for enhanced security and tracking.
                        </p>
                        <p className="text-gray-400 text-xs">
                          Please ensure you send the exact amount to the address above. Double-check the network before sending.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'international' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">International Payment</h3>
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    For international donations, we support:
                  </p>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                      PayPal: donations@saintlammyfoundation.org
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                      Stripe (Credit/Debit Cards)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                      Wise (Bank Transfer)
                    </li>
                  </ul>
                  <p className="text-sm text-gray-400">
                    Contact us at hello@saintlammyfoundation.org for assistance with international donations.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleDonation}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans"
              >
                {paymentMethod === 'card' ? 'Donate Now' :
                 paymentMethod === 'bank' ? 'Confirm Bank Transfer' :
                 paymentMethod === 'crypto' ? 'Confirm Crypto Donation' :
                 'Contact for International Donation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;