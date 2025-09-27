import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Heart, Shield, TrendingUp, Copy, CheckCircle, CreditCard, Bitcoin, Banknote, Globe, ChevronDown, ExternalLink } from 'lucide-react';
// Use simple SVG icons instead of heavy react-icons
const BitcoinIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">₿</div>
);
const EthereumIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>
);
const TetherIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">₮</div>
);
const RippleIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✕</div>
);
import { getWalletAddress, copyToClipboard } from '@/lib/walletConfig';

const Donate: React.FC = () => {
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

  type CryptoCurrencyKey = 'btc' | 'eth' | 'usdc' | 'usdt' | 'xrp';

  const cryptoCurrencies: Record<CryptoCurrencyKey, any> = {
    btc: {
      name: 'Bitcoin (BTC)',
      symbol: 'BTC',
      icon: BitcoinIcon,
      color: 'from-orange-500 to-orange-600',
      networks: {
        bitcoin: {
          name: 'Bitcoin Network',
          address: getWalletAddress('btc')?.address || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          explorer: 'https://blockstream.info/tx/'
        }
      }
    },
    eth: {
      name: 'Ethereum (ETH)',
      symbol: 'ETH',
      icon: EthereumIcon,
      color: 'from-blue-500 to-blue-600',
      networks: {
        erc20: {
          name: 'Ethereum (ERC20)',
          address: '0x742d35Cc7e4F8C6f8C4a8e8B8f9C9c8f8c8f8c8f',
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
          address: 'GKvqsuNcnwWqPzzuhLmGi4rzzh55FhJtGizkhHadjqMX',
          explorer: 'https://explorer.solana.com/tx/'
        },
        erc20: {
          name: 'Ethereum (ERC20)',
          address: '0x742d35Cc7e4F8C6f8C4a8e8B8f9C9c8f8c8f8c8f',
          explorer: 'https://etherscan.io/tx/'
        },
        bep20: {
          name: 'BSC (BEP20)',
          address: 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          explorer: 'https://bscscan.com/tx/'
        },
        trc20: {
          name: 'Tron (TRC20)',
          address: 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
          explorer: 'https://tronscan.org/#/transaction/'
        }
      }
    },
    usdt: {
      name: 'Tether (USDT)',
      symbol: 'USDT',
      icon: TetherIcon,
      color: 'from-green-500 to-green-600',
      networks: {
        sol: {
          name: 'Solana',
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          explorer: 'https://explorer.solana.com/tx/'
        },
        erc20: {
          name: 'Ethereum (ERC20)',
          address: '0x742d35Cc7e4F8C6f8C4a8e8B8f9C9c8f8c8f8c8f',
          explorer: 'https://etherscan.io/tx/'
        },
        bep20: {
          name: 'BSC (BEP20)',
          address: 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          explorer: 'https://bscscan.com/tx/'
        },
        trc20: {
          name: 'Tron (TRC20)',
          address: 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz',
          explorer: 'https://tronscan.org/#/transaction/'
        }
      }
    },
    xrp: {
      name: 'XRP (XRP)',
      symbol: 'XRP',
      icon: RippleIcon,
      color: 'from-indigo-500 to-indigo-600',
      networks: {
        xrpl: {
          name: 'XRP Ledger',
          address: 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy',
          explorer: 'https://xrpscan.com/tx/',
          memo: 'Tag: 12345678'
        }
      }
    }
  };

  const impactLevels = {
    USD: [
      {
        amount: 25,
        title: 'Feed a Family',
        description: 'Provides a week of nutritious meals for a family of 4',
        icon: Heart,
        color: 'from-green-500 to-green-600'
      },
      {
        amount: 50,
        title: 'School Supplies',
        description: 'Complete school supplies package for one child',
        icon: TrendingUp,
        color: 'from-blue-500 to-blue-600'
      },
      {
        amount: 100,
        title: 'Medical Care',
        description: 'Basic medical treatment for one person',
        icon: Shield,
        color: 'from-purple-500 to-purple-600'
      },
      {
        amount: 250,
        title: 'Monthly Support',
        description: 'One month of comprehensive support for a widow',
        icon: Heart,
        color: 'from-red-500 to-red-600'
      },
      {
        amount: 500,
        title: 'Skills Training',
        description: 'Vocational training course for one person',
        icon: TrendingUp,
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        amount: 1000,
        title: 'Transform a Life',
        description: 'Comprehensive support package for 6 months',
        icon: Shield,
        color: 'from-accent-500 to-accent-600'
      }
    ],
    NGN: [
      {
        amount: 10000,
        title: 'Feed a Family',
        description: 'Provides a week of nutritious meals for a family of 4',
        icon: Heart,
        color: 'from-green-500 to-green-600'
      },
      {
        amount: 20000,
        title: 'School Supplies',
        description: 'Complete school supplies package for one child',
        icon: TrendingUp,
        color: 'from-blue-500 to-blue-600'
      },
      {
        amount: 40000,
        title: 'Medical Care',
        description: 'Basic medical treatment for one person',
        icon: Shield,
        color: 'from-purple-500 to-purple-600'
      },
      {
        amount: 100000,
        title: 'Monthly Support',
        description: 'One month of comprehensive support for a widow',
        icon: Heart,
        color: 'from-red-500 to-red-600'
      },
      {
        amount: 200000,
        title: 'Skills Training',
        description: 'Vocational training course for one person',
        icon: TrendingUp,
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        amount: 400000,
        title: 'Transform a Life',
        description: 'Comprehensive support package for 6 months',
        icon: Shield,
        color: 'from-accent-500 to-accent-600'
      }
    ]
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

  const handleCopyToClipboard = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(''), 2000);
    }
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

    // Try to get address from wallet config first
    const walletInfo = getWalletAddress(selectedCrypto.toLowerCase());
    if (walletInfo && walletInfo.network === selectedNetwork) {
      return walletInfo.address;
    }

    // Fallback to static addresses
    return cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks[selectedNetwork]?.address || '';
  };

  const getCurrentNetworkExplorer = () => {
    if (!selectedCrypto || !selectedNetwork) return '';
    return cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks[selectedNetwork]?.explorer || '';
  };

  const getCurrentMemo = () => {
    if (!selectedCrypto || !selectedNetwork) return '';

    // Try to get memo from wallet config first
    const walletInfo = getWalletAddress(selectedCrypto.toLowerCase());
    if (walletInfo && walletInfo.memo) {
      return walletInfo.memo;
    }

    // Fallback to static memo
    return cryptoCurrencies[selectedCrypto as CryptoCurrencyKey]?.networks[selectedNetwork]?.memo || '';
  };

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString());
  };

  const getCurrencySymbol = () => currencies[selectedCurrency as keyof typeof currencies].symbol;
  const getCurrentPresetAmounts = () => presetAmounts[selectedCurrency as keyof typeof presetAmounts];
  const getCurrentImpactLevels = () => impactLevels[selectedCurrency as keyof typeof impactLevels];

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currencies[currency as keyof typeof currencies].symbol;
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <Layout>
      <Head>
        <title>Donate - Saintlammy Foundation</title>
        <meta name="description" content="Support Saintlammy Foundation with secure donations. Credit card, bank transfer, cryptocurrency, and international payment options available." />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="py-32 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Make a Donation
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Your generosity transforms lives. Choose how you'd like to support our mission of empowering widows, orphans, and vulnerable communities.
            </p>
          </div>
        </section>

        {/* Impact Levels */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Your Impact
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                See exactly how your donation creates positive change in our communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentImpactLevels().map((level, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 hover:border-accent-500 transition-colors cursor-pointer group"
                  onClick={() => handleAmountSelect(level.amount)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${level.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <level.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-accent-400 mb-2">{formatAmount(level.amount, selectedCurrency)}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">{level.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-light">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-300 dark:border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 font-display">
                  Complete Your Donation
                </h2>
                <p className="text-gray-600 dark:text-gray-300 font-light">
                  Choose your donation amount and preferred payment method
                </p>
              </div>

              <div className="space-y-8">
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
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
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
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bank Transfer Details</h3>
                    <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-xl p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Account Name:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white font-medium">{bankDetails.accountNumber}</span>
                          <button
                            onClick={() => handleCopyToClipboard(bankDetails.accountNumber, 'account')}
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
                          const IconComponent = crypto.icon as any;
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
                                {typeof IconComponent === 'function' ? (
                                  <IconComponent />
                                ) : (
                                  <IconComponent className="w-6 h-6 text-white" />
                                )}
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
                            className="w-full p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-left flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                          >
                            <span>
                              {selectedNetwork
                                ? cryptoCurrencies[selectedCrypto as CryptoCurrencyKey].networks[selectedNetwork].name
                                : 'Choose a network...'}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${
                              networkDropdownOpen ? 'rotate-180' : ''
                            }`} />
                          </button>

                          {networkDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden z-10">
                              {Object.entries(cryptoCurrencies[selectedCrypto as CryptoCurrencyKey].networks).map(([networkId, network]) => (
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
                      <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {cryptoCurrencies[selectedCrypto as CryptoCurrencyKey].name} Address ({cryptoCurrencies[selectedCrypto as CryptoCurrencyKey].networks[selectedNetwork].name}):
                          </span>
                          <button
                            onClick={() => handleCopyToClipboard(getCurrentCryptoAddress(), 'address')}
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
                        <div className="bg-gray-300 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white break-all">
                          {getCurrentCryptoAddress()}
                        </div>

                        {getCurrentMemo() && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Memo/Tag (Required):</span>
                              <button
                                onClick={() => handleCopyToClipboard(getCurrentMemo(), 'memo')}
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
                            <div className="bg-gray-300 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white">
                              {getCurrentMemo()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Donor Information Form */}
                    {selectedCrypto && selectedNetwork && (
                      <div className="bg-gray-200/30 dark:bg-gray-700/30 rounded-xl p-6 space-y-4">
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Donor Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={cryptoFormData.name}
                            onChange={(e) => handleCryptoFormChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={cryptoFormData.email}
                            onChange={(e) => handleCryptoFormChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Transaction Hash (after sending)"
                          value={cryptoFormData.transactionHash}
                          onChange={(e) => handleCryptoFormChange('transactionHash', e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors font-sans"
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
                            <p className="text-gray-900 dark:text-white font-medium">Blockchain Traceability & Dynamic Wallets</p>
                            <p className="text-gray-700 dark:text-gray-300">
                              All cryptocurrency donations are fully traceable on the blockchain. This address is dynamically generated and managed through our secure wallet system for enhanced security and tracking.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
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
                    <div className="bg-gray-200/50 dark:bg-gray-700/50 rounded-xl p-6">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        For international donations, we support:
                      </p>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Contact us at hello@saintlammyfoundation.org for assistance with international donations.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button className="w-full bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-medium text-base transition-colors shadow-lg hover:shadow-xl font-sans">
                  {paymentMethod === 'card' ? 'Donate Now' :
                   paymentMethod === 'bank' ? 'Confirm Bank Transfer' :
                   paymentMethod === 'crypto' ? 'Confirm Crypto Donation' :
                   'Contact for International Donation'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Transparency */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                Security & Transparency
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Your donations are secure and every naira is tracked with complete transparency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">Secure Payments</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                  Bank-level encryption and secure payment processing for all transactions
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">100% Transparency</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                  Detailed financial reports and impact tracking for every donation
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-300 dark:border-gray-700 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">Tax Receipts</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-light">
                  Automatic tax-deductible receipts for all eligible donations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways to Help */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-display-md md:text-display-lg font-medium text-gray-900 dark:text-white mb-6 font-display tracking-tight">
              Other Ways to Help
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Can't donate right now? There are many other ways to support our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gray-200/50 dark:bg-white/10 hover:bg-gray-300/50 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans">
                Volunteer Your Time
              </button>
              <button className="bg-gray-200/50 dark:bg-white/10 hover:bg-gray-300/50 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans">
                Share Our Mission
              </button>
              <button className="bg-gray-200/50 dark:bg-white/10 hover:bg-gray-300/50 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-base transition-colors font-sans">
                Corporate Partnership
              </button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Donate;