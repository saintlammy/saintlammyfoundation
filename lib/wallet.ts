import { ethers } from 'ethers';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import TronWeb from 'tronweb';
import { Client } from 'xrpl';

export interface WalletAddress {
  id: string;
  currency: string;
  network: string;
  address: string;
  privateKey?: string;
  memo?: string;
  createdAt: Date;
  isActive: boolean;
}

export class WalletManager {
  private static instance: WalletManager;
  private wallets: Map<string, WalletAddress> = new Map();

  private constructor() {}

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  // Generate Bitcoin address (using Ethereum wallet format for simplicity)
  generateBitcoinAddress(): WalletAddress {
    const wallet = ethers.Wallet.createRandom();
    const walletAddress: WalletAddress = {
      id: `btc-${Date.now()}`,
      currency: 'BTC',
      network: 'bitcoin',
      address: wallet.address, // In production, use proper Bitcoin address generation
      privateKey: wallet.privateKey,
      createdAt: new Date(),
      isActive: true
    };

    this.wallets.set(walletAddress.id, walletAddress);
    return walletAddress;
  }

  // Generate Ethereum address
  generateEthereumAddress(): WalletAddress {
    const wallet = ethers.Wallet.createRandom();
    const walletAddress: WalletAddress = {
      id: `eth-${Date.now()}`,
      currency: 'ETH',
      network: 'erc20',
      address: wallet.address,
      privateKey: wallet.privateKey,
      createdAt: new Date(),
      isActive: true
    };

    this.wallets.set(walletAddress.id, walletAddress);
    return walletAddress;
  }

  // Generate Solana address
  generateSolanaAddress(): WalletAddress {
    const keypair = Keypair.generate();
    const walletAddress: WalletAddress = {
      id: `sol-${Date.now()}`,
      currency: 'SOL',
      network: 'sol',
      address: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      createdAt: new Date(),
      isActive: true
    };

    this.wallets.set(walletAddress.id, walletAddress);
    return walletAddress;
  }

  // Generate Tron address
  generateTronAddress(): WalletAddress {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io'
    });

    const account = tronWeb.utils.accounts.generateAccount();
    const walletAddress: WalletAddress = {
      id: `tron-${Date.now()}`,
      currency: 'TRX',
      network: 'trc20',
      address: account.address.base58,
      privateKey: account.privateKey,
      createdAt: new Date(),
      isActive: true
    };

    this.wallets.set(walletAddress.id, walletAddress);
    return walletAddress;
  }

  // Generate XRP address
  async generateXRPAddress(): Promise<WalletAddress> {
    const client = new Client('wss://xrplcluster.com');
    await client.connect();

    const wallet = client.wallet.generate();
    const memo = Math.floor(Math.random() * 999999999).toString();

    const walletAddress: WalletAddress = {
      id: `xrp-${Date.now()}`,
      currency: 'XRP',
      network: 'xrpl',
      address: wallet.classicAddress,
      privateKey: wallet.seed,
      memo: `Tag: ${memo}`,
      createdAt: new Date(),
      isActive: true
    };

    await client.disconnect();
    this.wallets.set(walletAddress.id, walletAddress);
    return walletAddress;
  }

  // Generate address for specific currency and network
  async generateAddress(currency: string, network: string): Promise<WalletAddress> {
    switch (currency.toLowerCase()) {
      case 'btc':
        return this.generateBitcoinAddress();
      case 'eth':
        return this.generateEthereumAddress();
      case 'usdc':
      case 'usdt':
        switch (network) {
          case 'sol':
            return this.generateSolanaAddress();
          case 'erc20':
            return this.generateEthereumAddress();
          case 'bep20':
            return this.generateEthereumAddress(); // BSC uses Ethereum-compatible addresses
          case 'trc20':
            return this.generateTronAddress();
          default:
            throw new Error(`Unsupported network for ${currency}: ${network}`);
        }
      case 'xrp':
        return await this.generateXRPAddress();
      default:
        throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  // Get all wallets
  getAllWallets(): WalletAddress[] {
    return Array.from(this.wallets.values());
  }

  // Get wallets by currency
  getWalletsByCurrency(currency: string): WalletAddress[] {
    return Array.from(this.wallets.values()).filter(
      wallet => wallet.currency.toLowerCase() === currency.toLowerCase()
    );
  }

  // Get wallet by ID
  getWalletById(id: string): WalletAddress | undefined {
    return this.wallets.get(id);
  }

  // Deactivate wallet
  deactivateWallet(id: string): boolean {
    const wallet = this.wallets.get(id);
    if (wallet) {
      wallet.isActive = false;
      return true;
    }
    return false;
  }

  // Get active wallets
  getActiveWallets(): WalletAddress[] {
    return Array.from(this.wallets.values()).filter(wallet => wallet.isActive);
  }

  // Get address for donation (returns the most recent active address for currency/network)
  getDonationAddress(currency: string, network: string): string | null {
    const wallets = Array.from(this.wallets.values())
      .filter(wallet =>
        wallet.currency.toLowerCase() === currency.toLowerCase() &&
        wallet.network === network &&
        wallet.isActive
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return wallets.length > 0 ? wallets[0].address : null;
  }

  // Get memo for donation
  getDonationMemo(currency: string, network: string): string | null {
    const wallets = Array.from(this.wallets.values())
      .filter(wallet =>
        wallet.currency.toLowerCase() === currency.toLowerCase() &&
        wallet.network === network &&
        wallet.isActive
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return wallets.length > 0 ? wallets[0].memo || null : null;
  }
}

export const walletManager = WalletManager.getInstance();