import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Heart, Shield, TrendingUp, Copy, CheckCircle, CreditCard, Bitcoin,
  X, Clock, AlertCircle, ExternalLink, Loader2, RefreshCw
} from 'lucide-react';
import { SiBitcoin, SiEthereum, SiPaypal, SiTether, SiRipple, SiBinance } from 'react-icons/si';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Image from 'next/image';
import { DonationContext } from './DonationModalProvider';
import { paymentService, DonationData, PaymentResult, CryptoPaymentResult } from '@/lib/paymentService';

interface NewDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: DonationContext | null;
}

type PaymentStep = 'details' | 'payment' | 'processing' | 'success' | 'error';

const NewDonationModal: React.FC<NewDonationModalProps> = ({ isOpen, onClose, context }) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly' | 'yearly'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'crypto' | 'card' | 'bank'>('paypal');
  const [cryptoCurrency, setCryptoCurrency] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC' | 'XRP' | 'BNB' | 'SOL' | 'TRX'>('BTC');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  // Donor information
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

  // UI state
  const [currentStep, setCurrentStep] = useState<PaymentStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | CryptoPaymentResult | null>(null);

  // Crypto-specific state
  const [cryptoPaymentData, setCryptoPaymentData] = useState<CryptoPaymentResult | null>(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [paymentExpiry, setPaymentExpiry] = useState<Date | null>(null);

  const presetAmounts = currency === 'USD'
    ? [25, 50, 100, 250, 500, 1000]
    : [5000, 10000, 25000, 50000, 100000, 250000]; // NGN amounts

  // Initialize from context
  // Initialize and reset state when modal opens (consolidated to prevent flickering)
  // useLayoutEffect runs synchronously before browser paint, preventing flicker
  useLayoutEffect(() => {
    if (isOpen) {
      // Reset state first
      setCurrentStep('details');
      setError('');
      setPaymentResult(null);
      setCryptoPaymentData(null);
      setTransactionHash('');
      setCopiedAddress(false);

      // Then apply context values if provided
      if (context) {
        if (context.amount) setAmount(context.amount.toString());
        if (context.preferredMethod === 'crypto') {
          setPaymentMethod('crypto');
        } else if (context.preferredMethod === 'card') {
          setPaymentMethod('paypal'); // Default to PayPal for now
        }
      }
    }
  }, [context, isOpen]);

  // Reset payment method when currency changes (skip initial mount)
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (currency === 'USD') {
      // For USD, default to PayPal, but allow crypto
      if (paymentMethod === 'card' || paymentMethod === 'bank') {
        setPaymentMethod('paypal');
      }
    } else if (currency === 'NGN') {
      // For NGN, default to PayPal, but allow card and bank
      if (paymentMethod === 'crypto') {
        setPaymentMethod('paypal');
      }
    }
    // Clear amount when currency changes to avoid confusion
    setAmount('');
  }, [currency]);

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const validateForm = (): boolean => {
    const numAmount = parseFloat(amount);
    const minAmount = currency === 'USD' ? 1 : 100; // $1 USD or ₦100 NGN minimum
    const currencySymbol = currency === 'USD' ? '$' : '₦';

    if (!amount || isNaN(numAmount) || numAmount < minAmount) {
      setError(`Please enter a valid donation amount (minimum ${currencySymbol}${minAmount})`);
      return false;
    }
    // Email is optional, but if provided, must be valid
    if (donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (paymentMethod === 'crypto' && (!cryptoCurrency || !selectedNetwork)) {
      setError('Please select both cryptocurrency and network');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setError('');
      setCurrentStep('payment');
    }
  };

  const createDonationData = (): DonationData => ({
    amount: parseFloat(amount),
    currency,
    donationType,
    donorName: donorName || 'Anonymous',
    donorEmail: donorEmail || undefined, // Send undefined instead of empty string
    message: donorMessage || undefined,
    source: context?.source || 'modal',
    category: context?.category,
    campaignId: context?.campaignId, // Link donation to campaign
    paymentMethod,
    cryptoCurrency: paymentMethod === 'crypto' ? cryptoCurrency : undefined,
    network: paymentMethod === 'crypto' ? selectedNetwork : undefined
  });

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const donationData = createDonationData();
      const result = await paymentService.processPayPalDonation(donationData);

      if (result.success && result.approvalUrl) {
        // Redirect to PayPal
        window.location.href = result.approvalUrl;
      } else {
        throw new Error(result.error || 'PayPal payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setCurrentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    // Validate form before processing
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const donationData = createDonationData();
      const result = await paymentService.processCryptoDonation(donationData) as CryptoPaymentResult;

      if (result.success) {
        setCryptoPaymentData(result);
        setPaymentExpiry(result.expiresAt || null);
        setCurrentStep('processing');
      } else {
        throw new Error(result.error || 'Crypto payment setup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setCurrentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAddress = async () => {
    if (cryptoPaymentData?.walletAddress) {
      await navigator.clipboard.writeText(cryptoPaymentData.walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!transactionHash || !cryptoPaymentData?.paymentId) {
      setError('Please enter the transaction hash');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentService.submitCryptoTransaction(
        cryptoPaymentData.paymentId,
        transactionHash
      );

      if (result.success) {
        setCurrentStep('success');
      } else {
        throw new Error(result.error || 'Transaction submission failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction submission failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (currency === 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatCrypto = (amount: number, currency: string) => {
    const decimals = currency === 'BTC' ? 8 : currency === 'ETH' ? 6 : 2;
    return `${amount.toFixed(decimals)} ${currency}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 dark:bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Make a Donation</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {context?.title || 'Support our mission'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Step 1: Donation Details */}
        {currentStep === 'details' && (
          <div className="p-6 space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`p-3 rounded-lg border text-center font-medium transition-all ${
                    currency === 'USD'
                      ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  USD ($) - International
                </button>
                <button
                  onClick={() => setCurrency('NGN')}
                  className={`p-3 rounded-lg border text-center font-medium transition-all ${
                    currency === 'NGN'
                      ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  NGN (₦) - Nigerian Naira
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Amount ({currency})
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAmountSelect(preset)}
                    className={`p-3 rounded-lg border text-center font-medium transition-all ${
                      amount === preset.toString()
                        ? 'border-accent-500 bg-accent-500/20 text-accent-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    {currency === 'USD' ? '$' : '₦'}{preset.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={`Enter custom amount in ${currency}`}
                value={amount}
                onChange={handleCustomAmount}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Donation Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'one-time', label: 'One Time', description: 'Single donation' },
                  { value: 'monthly', label: 'Monthly', description: 'Recurring monthly' },
                  { value: 'yearly', label: 'Yearly', description: 'Recurring yearly' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDonationType(option.value as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      donationType === option.value
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                {/* PayPal - Available for both USD and NGN */}
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-accent-500 bg-accent-500/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <SiPaypal className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">PayPal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Credit card, debit card, or PayPal balance</div>
                      </div>
                    </div>
                    {donationType !== 'one-time' && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        Recurring supported
                      </span>
                    )}
                  </div>
                </button>

                {/* Credit Card - Only for NGN */}
                {currency === 'NGN' && (
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-green-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Nigerian Naira only - Visa, Mastercard, Verve</div>
                        </div>
                      </div>
                      {donationType !== 'one-time' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Recurring supported
                        </span>
                      )}
                    </div>
                  </button>
                )}

                {/* Bank Transfer - Only for NGN */}
                {currency === 'NGN' && (
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">🏦</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Bank Transfer</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Direct bank transfer in Nigerian Naira</div>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                        One-time only
                      </span>
                    </div>
                  </button>
                )}

                {/* Cryptocurrency - Only for USD */}
                {currency === 'USD' && (
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'crypto'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bitcoin className="w-6 h-6 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Cryptocurrency</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">BTC, ETH, USDC, USDT, XRP, BNB</div>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                        One-time only
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Crypto Currency Selection */}
            {paymentMethod === 'crypto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Cryptocurrency
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      value: 'BTC',
                      label: 'Bitcoin',
                      symbol: 'BTC',
                      icon: SiBitcoin,
                      color: 'from-orange-500 to-orange-600'
                    },
                    {
                      value: 'ETH',
                      label: 'Ethereum',
                      symbol: 'ETH',
                      icon: SiEthereum,
                      color: 'from-blue-500 to-blue-600'
                    },
                    {
                      value: 'USDC',
                      label: 'USD Coin',
                      symbol: 'USDC',
                      icon: () => <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>,
                      color: 'from-blue-400 to-blue-500'
                    },
                    {
                      value: 'USDT',
                      label: 'Tether',
                      symbol: 'USDT',
                      icon: SiTether,
                      color: 'from-green-500 to-green-600'
                    },
                    {
                      value: 'XRP',
                      label: 'XRP',
                      symbol: 'XRP',
                      icon: SiRipple,
                      color: 'from-indigo-500 to-indigo-600'
                    },
                    {
                      value: 'BNB',
                      label: 'BNB Coin',
                      symbol: 'BNB',
                      icon: SiBinance,
                      color: 'from-yellow-500 to-yellow-600'
                    }
                  ].map((crypto) => {
                    const IconComponent = crypto.icon;
                    return (
                      <button
                        key={crypto.value}
                        onClick={() => {
                          setCryptoCurrency(crypto.value as any);
                          setSelectedNetwork('');
                        }}
                        className={`p-4 rounded-lg border transition-all text-center group ${
                          cryptoCurrency === crypto.value
                            ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
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

                {/* Network Selection */}
                {cryptoCurrency && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Network
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cryptoCurrency === 'BTC' && (
                        <button
                          onClick={() => setSelectedNetwork('bitcoin')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedNetwork === 'bitcoin'
                              ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">Bitcoin Network</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">1-6 confirmations</div>
                        </button>
                      )}

                      {cryptoCurrency === 'ETH' && (
                        <button
                          onClick={() => setSelectedNetwork('erc20')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedNetwork === 'erc20'
                              ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">Ethereum (ERC20)</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">12-20 confirmations</div>
                        </button>
                      )}

                      {(cryptoCurrency === 'USDC' || cryptoCurrency === 'USDT') && (
                        <>
                          <button
                            onClick={() => setSelectedNetwork('sol')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedNetwork === 'sol'
                                ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium">Solana</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Fast & low fees</div>
                          </button>
                          <button
                            onClick={() => setSelectedNetwork('erc20')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedNetwork === 'erc20'
                                ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium">Ethereum (ERC20)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">12-20 confirmations</div>
                          </button>
                          <button
                            onClick={() => setSelectedNetwork('bep20')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedNetwork === 'bep20'
                                ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium">BSC (BEP20)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Low fees</div>
                          </button>
                          <button
                            onClick={() => setSelectedNetwork('trc20')}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedNetwork === 'trc20'
                                ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                            }`}
                          >
                            <div className="font-medium">Tron (TRC20)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Ultra low fees</div>
                          </button>
                        </>
                      )}

                      {cryptoCurrency === 'XRP' && (
                        <button
                          onClick={() => setSelectedNetwork('xrpl')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedNetwork === 'xrpl'
                              ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">XRP Ledger</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Requires memo/tag</div>
                        </button>
                      )}

                      {cryptoCurrency === 'BNB' && (
                        <button
                          onClick={() => setSelectedNetwork('bep20')}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedNetwork === 'bep20'
                              ? 'border-accent-500 bg-accent-500/20 text-gray-900 dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent-400 bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">BSC (BEP20)</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Binance Smart Chain</div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  required
                />
              </div>
              <textarea
                placeholder="Message or dedication (Optional)"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-medium transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 'payment' && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Your Donation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formatCurrency(parseFloat(amount))} {donationType !== 'one-time' && `(${donationType})`}
              </p>
            </div>

            {paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">You'll be redirected to PayPal to complete your donation</p>
                </div>

                <button
                  onClick={handlePayPalPayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <SiPaypal className="w-5 h-5" />
                      <span>Continue with PayPal</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Generate payment address and QR code</p>
                </div>

                <button
                  onClick={handleCryptoPayment}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Bitcoin className="w-5 h-5" />
                      <span>Generate {cryptoCurrency} Payment</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Pay with your credit or debit card in Nigerian Naira</p>
                </div>

                <button
                  onClick={() => {
                    // TODO: Implement Paystack/Flutterwave integration for NGN
                    setError('Credit card payment coming soon! Please use PayPal for now.');
                  }}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with Card (NGN)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Get bank details for direct transfer in Nigerian Naira</p>
                </div>

                <button
                  onClick={() => {
                    // TODO: Show bank transfer details
                    setError('Bank transfer details coming soon! Please use PayPal for now.');
                  }}
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="text-lg">🏦</span>
                      <span>Get Bank Details (NGN)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() => setCurrentStep('details')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back to Details
            </button>
          </div>
        )}

        {/* Step 3: Processing (Crypto Payment) */}
        {currentStep === 'processing' && cryptoPaymentData && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Your {cryptoCurrency} Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send exactly {formatCrypto(cryptoPaymentData.cryptoAmount || 0, cryptoCurrency)}
                {' '}via {
                  selectedNetwork === 'bitcoin' ? 'Bitcoin Network' :
                  selectedNetwork === 'erc20' ? 'Ethereum (ERC-20)' :
                  selectedNetwork === 'sol' ? 'Solana' :
                  selectedNetwork === 'bep20' ? 'BSC (BEP-20)' :
                  selectedNetwork === 'trc20' ? 'Tron (TRC-20)' :
                  selectedNetwork === 'xrpl' ? 'XRP Ledger' :
                  'selected network'
                } to complete your {formatCurrency(parseFloat(amount))} donation
              </p>
            </div>

            {/* QR Code */}
            {cryptoPaymentData.qrCode && (
              <div className="flex justify-center">
                <div className="p-4 bg-white dark:bg-gray-100 border border-gray-200 dark:border-gray-300 rounded-lg">
                  <Image
                    src={cryptoPaymentData.qrCode}
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                </div>
              </div>
            )}

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cryptoPaymentData.walletAddress}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                />
                <button
                  onClick={handleCopyAddress}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copiedAddress ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* XRP Destination Tag */}
            {cryptoCurrency === 'XRP' && selectedNetwork === 'xrpl' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination Tag (Required for XRP)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="12345678"
                    readOnly
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("12345678");
                      setCopiedAddress(true);
                      setTimeout(() => setCopiedAddress(false), 2000);
                    }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copiedAddress ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="text-sm text-red-700 dark:text-red-300">
                      <p className="font-medium">XRP Destination Tag Required</p>
                      <p className="text-xs mt-1">
                        You MUST include this destination tag when sending XRP, otherwise your payment will be lost and cannot be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="bg-yellow-50 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Payment Instructions:</p>
                  <div className="space-y-1 text-xs">
                    <p>• Send exactly {formatCrypto(cryptoPaymentData.cryptoAmount || 0, cryptoCurrency)}</p>
                    <p>• Network: {
                      selectedNetwork === 'bitcoin' ? 'Bitcoin Network' :
                      selectedNetwork === 'erc20' ? 'Ethereum (ERC-20)' :
                      selectedNetwork === 'sol' ? 'Solana' :
                      selectedNetwork === 'bep20' ? 'BSC (BEP-20)' :
                      selectedNetwork === 'trc20' ? 'Tron (TRC-20)' :
                      selectedNetwork === 'xrpl' ? 'XRP Ledger' :
                      'Selected Network'
                    }</p>
                    <p>• Confirmations: {
                      selectedNetwork === 'bitcoin' ? '1-6' :
                      selectedNetwork === 'erc20' ? '12-20' :
                      selectedNetwork === 'sol' ? '32' :
                      selectedNetwork === 'bep20' ? '12' :
                      selectedNetwork === 'trc20' ? '19' :
                      selectedNetwork === 'xrpl' ? '1-3' :
                      'Variable'
                    }</p>
                    {selectedNetwork === 'xrpl' && <p>• <strong>Important:</strong> Must include memo/tag for XRP transactions</p>}
                    <p>• Payment expires in 24 hours</p>
                    <p>• After sending, enter your transaction hash below</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Hash Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Hash (after payment)
              </label>
              <input
                type="text"
                placeholder="Enter transaction hash from your wallet"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleSubmitTransaction}
                disabled={!transactionHash || isProcessing}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Transaction...</span>
                  </div>
                ) : (
                  'Submit Transaction Hash'
                )}
              </button>

              <button
                onClick={() => setCurrentStep('payment')}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Payment Methods
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 'success' && (
          <div className="p-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your {formatCurrency(parseFloat(amount))} donation has been received and is being processed.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• You'll receive an email confirmation</li>
                <li>• {paymentMethod === 'crypto' ? 'Transaction verification (1-6 confirmations)' : 'Payment processing'}</li>
                <li>• Tax receipt will be emailed within 24 hours</li>
                <li>• Updates on how your donation helps our mission</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Step 5: Error */}
        {currentStep === 'error' && (
          <div className="p-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Failed</h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentStep('payment')}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-4 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={onClose}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDonationModal;