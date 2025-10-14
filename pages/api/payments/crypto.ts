import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as QRCode from 'qrcode';
import { donationService } from '@/lib/donationService';
import { CryptoDonationSchema } from '@/lib/schemas';
import { validateInput, sanitizeHtml } from '@/lib/validation';
import { blockchainVerification } from '@/lib/blockchainVerification';

interface CryptoDonationRequest {
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'XRP' | 'BNB' | 'SOL' | 'TRX';
  network?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  source?: string;
  category?: string;
  campaignId?: string; // Link donation to campaign
}

interface CryptoRates {
  BTC: { USD: number };
  ETH: { USD: number };
  USDT: { USD: number };
  USDC: { USD: number };
  XRP: { USD: number };
  BNB: { USD: number };
  SOL: { USD: number };
  TRX: { USD: number };
}

interface CryptoDonationResponse {
  success: boolean;
  donationId: string;
  walletAddress: string;
  cryptoAmount: number;
  currency: string;
  usdAmount: number;
  qrCode: string;
  expiresAt: Date;
  paymentInstructions: string;
}

// Get wallet addresses from environment variables
type CurrencyKey = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'XRP' | 'BNB' | 'SOL' | 'TRON' | 'TRX';

const WALLET_ADDRESSES: Record<CurrencyKey, Record<string, string>> = {
  BTC: {
    bitcoin: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  ETH: {
    erc20: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34'
  },
  USDT: {
    sol: process.env.NEXT_PUBLIC_USDT_SOL_ADDRESS || 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    erc20: process.env.NEXT_PUBLIC_USDT_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    bep20: process.env.NEXT_PUBLIC_USDT_BSC_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    trc20: process.env.NEXT_PUBLIC_USDT_TRC_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz'
  },
  USDC: {
    sol: process.env.NEXT_PUBLIC_USDC_SOL_ADDRESS || 'GKvqsuNcnwWqPzzuhLmGi4rzzh55FhJtGizkhHadjqMX',
    erc20: process.env.NEXT_PUBLIC_USDC_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    bep20: process.env.NEXT_PUBLIC_USDC_BSC_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
    trc20: process.env.NEXT_PUBLIC_USDC_TRC_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz'
  },
  XRP: {
    xrpl: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || 'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy'
  },
  BNB: {
    bep20: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34'
  },
  SOL: {
    sol: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '11111111111111111111111111111111'
  },
  TRX: {
    trc20: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz'
  },
  TRON: {
    trc20: process.env.NEXT_PUBLIC_TRON_WALLET_ADDRESS || 'TLYjP1DqNDkbVpK8vLqZVqQvQzVzVzVzVzVzVz'
  }
};

// XRP destination tags
const XRP_DESTINATION_TAG = process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '12345678';

// Function to get real-time crypto prices
async function getCryptoPrices(): Promise<CryptoRates> {
  try {
    // Using CoinGecko API (free tier)
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,ripple,binancecoin,solana,tron&vs_currencies=usd',
      { timeout: 10000 }
    );

    return {
      BTC: { USD: response.data.bitcoin.usd },
      ETH: { USD: response.data.ethereum.usd },
      USDT: { USD: response.data.tether.usd },
      USDC: { USD: response.data['usd-coin'].usd },
      XRP: { USD: response.data.ripple.usd },
      BNB: { USD: response.data.binancecoin.usd },
      SOL: { USD: response.data.solana.usd },
      TRX: { USD: response.data.tron.usd }
    };
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    // Fallback prices (should be updated regularly)
    return {
      BTC: { USD: 45000 },
      ETH: { USD: 2500 },
      USDT: { USD: 1 },
      USDC: { USD: 1 },
      XRP: { USD: 0.5 },
      BNB: { USD: 300 },
      SOL: { USD: 100 },
      TRX: { USD: 0.1 }
    };
  }
}

// Function to calculate crypto amount needed
function calculateCryptoAmount(usdAmount: number, cryptoPrice: number, currency: string): number {
  const amount = usdAmount / cryptoPrice;

  // Round to appropriate decimal places based on currency
  switch (currency) {
    case 'BTC':
      return Math.ceil(amount * 100000000) / 100000000; // 8 decimal places
    case 'ETH':
      return Math.ceil(amount * 1000000000000000000) / 1000000000000000000; // 18 decimal places
    case 'USDT':
    case 'USDC':
      return Math.ceil(amount * 1000000) / 1000000; // 6 decimal places
    case 'XRP':
      return Math.ceil(amount * 1000000) / 1000000; // 6 decimal places
    case 'BNB':
      return Math.ceil(amount * 100000000) / 100000000; // 8 decimal places
    case 'SOL':
      return Math.ceil(amount * 1000000000) / 1000000000; // 9 decimal places
    case 'TRX':
      return Math.ceil(amount * 1000000) / 1000000; // 6 decimal places
    default:
      return amount;
  }
}

// Function to generate payment URI for QR code
function generatePaymentURI(currency: string, network: string, address: string, amount: number, label?: string, memo?: string): string {
  const encodedLabel = label ? encodeURIComponent(label) : 'Saintlammy%20Foundation%20Donation';

  switch (currency) {
    case 'BTC':
      return `bitcoin:${address}?amount=${amount}&label=${encodedLabel}`;
    case 'ETH':
      return `ethereum:${address}?value=${amount * 1e18}&gas=21000`;
    case 'USDT':
    case 'USDC':
      if (network === 'erc20') {
        // ERC-20 token transfer
        return `ethereum:${address}?value=0&gas=60000&data=0xa9059cbb${address.slice(2).padStart(64, '0')}${Math.floor(amount * 1e6).toString(16).padStart(64, '0')}`;
      } else if (network === 'sol') {
        // Solana
        return `solana:${address}?amount=${amount}&label=${encodedLabel}`;
      } else if (network === 'bep20') {
        // BSC BEP-20 (uses same format as Ethereum)
        return `ethereum:${address}?value=${amount * 1e18}&gas=21000`;
      } else if (network === 'trc20') {
        // Tron TRC-20
        return `tron:${address}?amount=${amount}&label=${encodedLabel}`;
      }
      return address;
    case 'XRP':
      const memoParam = memo ? `&dt=${memo}` : '';
      return `xrp:${address}?amount=${amount}&label=${encodedLabel}${memoParam}`;
    case 'BNB':
      // BNB on BSC (BEP-20) uses Ethereum-like addresses and format
      return `ethereum:${address}?value=${amount * 1e18}&gas=21000`;
    case 'SOL':
      // Solana native token
      return `solana:${address}?amount=${amount}&label=${encodedLabel}`;
    case 'TRX':
      // Tron native token (TRC-20 format)
      return `tron:${address}?amount=${amount}&label=${encodedLabel}`;
    default:
      return address;
  }
}

// Function to update campaign progress
async function updateCampaignProgress(campaignId: string, donationAmount: number) {
  try {
    // Fetch current campaign
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/campaigns?id=${campaignId}`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      const campaign = result.data[0];
      const newAmount = campaign.current_amount + donationAmount;

      // Update campaign with new amount
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/campaigns?id=${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_amount: newAmount,
          // Auto-complete campaign if goal reached
          status: newAmount >= campaign.goal_amount ? 'completed' : campaign.status
        })
      });

      console.log(`Updated campaign ${campaignId}: ${newAmount}/${campaign.goal_amount}`);
    }
  } catch (error) {
    console.error('Error updating campaign progress:', error);
    // Don't throw - campaign update failure shouldn't break donation
  }
}

// Function to store donation attempt in database
async function storeCryptoDonation(donationData: any) {
  try {
    const donationId = await donationService.storeCryptoDonation({
      amount: donationData.amount,
      currency: donationData.currency,
      network: donationData.network,
      cryptoAmount: donationData.cryptoAmount,
      cryptoPrice: donationData.cryptoPrice,
      walletAddress: donationData.walletAddress,
      memo: donationData.memo,
      donorName: donationData.donorName,
      donorEmail: donationData.donorEmail,
      message: donationData.message,
      source: donationData.source,
      category: donationData.category as 'orphan' | 'widow' | 'home' | 'general',
      campaignId: donationData.campaignId, // Add campaign ID
    });

    console.log('Stored crypto donation with ID:', donationId);
    return donationId;
  } catch (error) {
    console.error('Error storing crypto donation:', error);
    // Fallback to temporary ID if database fails
    return `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Function to verify transaction using blockchain APIs
async function verifyTransaction(
  txHash: string,
  currency: string,
  expectedAmount: number,
  walletAddress: string,
  network: string
): Promise<{ isValid: boolean; confirmations: number; details?: any }> {
  try {
    console.log('Verifying transaction:', { txHash, currency, expectedAmount, walletAddress, network });

    const verification = await blockchainVerification.verifyTransaction(
      txHash,
      network,
      expectedAmount,
      walletAddress,
      currency
    );

    console.log('Blockchain verification result:', verification);

    return {
      isValid: verification.isValid,
      confirmations: verification.confirmations,
      details: {
        actualAmount: verification.amount,
        fromAddress: verification.fromAddress,
        toAddress: verification.toAddress,
        blockHeight: verification.blockHeight,
        timestamp: verification.timestamp,
        error: verification.error
      }
    };
  } catch (error) {
    console.error('Transaction verification error:', error);
    return {
      isValid: false,
      confirmations: 0,
      details: {
        error: error instanceof Error ? error.message : 'Unknown verification error'
      }
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create crypto donation request
    try {
      // Log incoming request for debugging
      console.log('📥 Crypto payment request received:', {
        category: req.body.category,
        amount: req.body.amount,
        currency: req.body.currency
      });

      // Validate input using schema
      const validation = validateInput(CryptoDonationSchema)(req.body);
      if (!validation.success) {
        console.error('❌ Validation failed:', validation.errors);
        return res.status(400).json({
          error: 'Invalid input data',
          details: validation.errors
        });
      }

      const donationData = validation.data;

      // Sanitize string inputs
      const sanitizedData = {
        ...donationData,
        donorName: donationData.donorName ? sanitizeHtml(donationData.donorName) : undefined,
        donorEmail: donationData.donorEmail ? sanitizeHtml(donationData.donorEmail) : undefined,
        message: donationData.message ? sanitizeHtml(donationData.message) : undefined
      };

      // Validate network
      const supportedNetworks: Record<string, string[]> = {
        BTC: ['bitcoin'],
        ETH: ['erc20'],
        USDT: ['sol', 'erc20', 'bep20', 'trc20'],
        USDC: ['sol', 'erc20', 'bep20', 'trc20'],
        XRP: ['xrpl'],
        BNB: ['bep20'],
        SOL: ['sol'],
        TRX: ['trc20']
      };

      const network = sanitizedData.network || (supportedNetworks[sanitizedData.currency] || [])[0];
      if (!network || !supportedNetworks[sanitizedData.currency]?.includes(network)) {
        return res.status(400).json({
          error: `Unsupported network for ${sanitizedData.currency}. Supported: ${supportedNetworks[sanitizedData.currency]?.join(', ')}`
        });
      }

      // Get current crypto prices
      const cryptoPrices = await getCryptoPrices();
      const cryptoPrice = (cryptoPrices as any)[sanitizedData.currency]?.USD;

      // Calculate crypto amount needed
      const cryptoAmount = calculateCryptoAmount(sanitizedData.amount, cryptoPrice, sanitizedData.currency);

      // Get wallet address for specific network
      const walletAddress = WALLET_ADDRESSES[sanitizedData.currency as CurrencyKey]?.[network];
      const memo = sanitizedData.currency === 'XRP' ? XRP_DESTINATION_TAG : undefined;

      if (!walletAddress) {
        return res.status(500).json({
          error: `Wallet address not configured for ${sanitizedData.currency} on ${network} network`
        });
      }

      // Generate payment URI and QR code
      const paymentURI = generatePaymentURI(sanitizedData.currency, network, walletAddress, cryptoAmount, 'Saintlammy Foundation Donation', memo);
      const qrCode = await QRCode.toDataURL(paymentURI);

      // Store donation attempt
      const donationId = await storeCryptoDonation({
        ...sanitizedData,
        network,
        cryptoAmount,
        cryptoPrice,
        walletAddress,
        memo,
      });

      // Create network-specific payment instructions
      const confirmationsMap: Record<string, string> = {
        bitcoin: '1-6',
        erc20: '12-20',
        sol: '32',
        bep20: '12',
        trc20: '19',
        xrpl: '1-3'
      };
      const confirmations = confirmationsMap[network] || '1-6';

      const networkNameMap: Record<string, string> = {
        bitcoin: 'Bitcoin Network',
        erc20: 'Ethereum (ERC-20)',
        sol: 'Solana',
        bep20: 'BSC (BEP-20)',
        trc20: 'Tron (TRC-20)',
        xrpl: 'XRP Ledger'
      };
      const networkName = networkNameMap[network] || network;

      let paymentInstructions = `
Send exactly ${cryptoAmount} ${sanitizedData.currency} to the address above.
Network: ${networkName}
Important:
- Send only ${sanitizedData.currency} on ${networkName}
- Send the exact amount to ensure proper tracking
- Payment expires in 24 hours
- Allow ${confirmations} confirmations for processing`;

      if (sanitizedData.currency === 'XRP' && memo) {
        paymentInstructions += `\n- IMPORTANT: Include destination tag: ${memo}`;
      }

      paymentInstructions = paymentInstructions.trim();

      const response: CryptoDonationResponse & { network?: string; memo?: string } = {
        success: true,
        donationId,
        walletAddress,
        cryptoAmount,
        currency: sanitizedData.currency,
        network,
        memo,
        usdAmount: sanitizedData.amount,
        qrCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        paymentInstructions
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error('Crypto payment error:', error);
      return res.status(500).json({
        error: 'Failed to create crypto donation',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // Check donation status
    const { donationId } = req.query;

    if (!donationId) {
      return res.status(400).json({ error: 'Missing donationId' });
    }

    try {
      // Get donation from database
      const donation = await donationService.getDonationById(donationId as string);

      if (!donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      return res.status(200).json({
        donationId: donation.id,
        status: donation.status,
        confirmations: donation.confirmations,
        requiredConfirmations: donation.requiredConfirmations,
        txHash: donation.txHash,
        confirmedAt: donation.confirmedAt,
        expiresAt: donation.expiresAt,
      });
    } catch (error) {
      console.error('Error checking donation status:', error);
      return res.status(500).json({
        error: 'Failed to check donation status'
      });
    }
  } else if (req.method === 'PUT') {
    // Update donation with transaction hash
    const { donationId, txHash } = req.body;

    if (!donationId || !txHash) {
      return res.status(400).json({
        error: 'Missing required fields: donationId, txHash'
      });
    }

    try {
      // Get donation from database first
      const donation = await donationService.getDonationById(donationId);
      if (!donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      // Update donation with transaction hash and set to pending verification
      const updated = await donationService.updateDonationStatus(donationId, 'pending', txHash);

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update donation' });
      }

      // Parse donation notes to get transaction details
      const notes = typeof donation.notes === 'string' ? JSON.parse(donation.notes) : donation.notes;
      const expectedAmount = notes?.cryptoAmount || 0;
      const walletAddress = notes?.walletAddress || '';
      const network = notes?.network || '';

      // Perform blockchain verification
      try {
        const verificationResult = await verifyTransaction(
          txHash,
          donation.currency,
          expectedAmount,
          walletAddress,
          network
        );

        console.log('Transaction verification completed:', verificationResult);

        // Update donation status based on verification result
        if (verificationResult.isValid) {
          await donationService.updateDonationStatus(donationId, 'completed', txHash);

          // Update campaign progress if donation is linked to a campaign
          if (donation.campaign_id) {
            await updateCampaignProgress(donation.campaign_id, donation.amount);
          }

          // Store verification details in notes
          const updatedNotes = {
            ...notes,
            verification: {
              verified: true,
              confirmations: verificationResult.confirmations,
              verifiedAt: new Date().toISOString(),
              details: verificationResult.details
            }
          };

          // Update notes with verification details
          await donationService.updateDonationNotes(donationId, {
            txHash,
            confirmations: verificationResult.confirmations,
            blockHeight: verificationResult.details?.blockHeight,
            timestamp: verificationResult.details?.timestamp,
            verifiedAmount: verificationResult.details?.actualAmount,
            fromAddress: verificationResult.details?.fromAddress,
            toAddress: verificationResult.details?.toAddress
          });

          return res.status(200).json({
            success: true,
            message: 'Transaction verified and donation completed',
            status: 'completed',
            verification: {
              confirmed: true,
              confirmations: verificationResult.confirmations,
              details: verificationResult.details
            }
          });
        } else {
          // Verification failed
          const updatedNotes = {
            ...notes,
            verification: {
              verified: false,
              confirmations: verificationResult.confirmations,
              verifiedAt: new Date().toISOString(),
              details: verificationResult.details
            }
          };

          await donationService.updateDonationNotes(donationId, {
            error: verificationResult.details?.error || 'Transaction verification failed',
            confirmations: verificationResult.confirmations,
            verifiedAmount: verificationResult.details?.actualAmount,
            fromAddress: verificationResult.details?.fromAddress,
            toAddress: verificationResult.details?.toAddress
          });

          return res.status(200).json({
            success: false,
            message: 'Transaction verification failed',
            status: 'verification_failed',
            verification: {
              confirmed: false,
              confirmations: verificationResult.confirmations,
              details: verificationResult.details
            }
          });
        }
      } catch (verificationError) {
        console.error('Verification error:', verificationError);

        // Store verification error in notes
        const updatedNotes = {
          ...notes,
          verification: {
            verified: false,
            error: verificationError instanceof Error ? verificationError.message : 'Unknown verification error',
            verifiedAt: new Date().toISOString()
          }
        };

        await donationService.updateDonationNotes(donationId, {
          error: verificationError instanceof Error ? verificationError.message : 'Unknown verification error'
        });

        return res.status(200).json({
          success: true,
          message: 'Transaction submitted for manual verification',
          status: 'pending_manual_verification',
          verification: {
            confirmed: false,
            error: 'Automatic verification failed - transaction will be manually reviewed'
          }
        });
      }
    } catch (error) {
      console.error('Error updating donation:', error);
      return res.status(500).json({
        error: 'Failed to update donation'
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}