// Lightweight wallet configuration for client-side use
// This replaces the heavy wallet.ts import on the client side

export interface WalletInfo {
  currency: string;
  network: string;
  address: string;
  explorer: string;
  memo?: string;
}

// Static wallet addresses from environment variables
export const getWalletAddresses = (): Record<string, WalletInfo> => {
  return {
    btc: {
      currency: 'BTC',
      network: 'bitcoin',
      address: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      explorer: 'https://blockstream.info/tx/'
    },
    eth: {
      currency: 'ETH',
      network: 'erc20',
      address: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS || '0x742d35Cc7e4F8C6f8C4a8e8B8f9C9c8f8c8f8c8f',
      explorer: 'https://etherscan.io/tx/'
    },
    sol: {
      currency: 'SOL',
      network: 'sol',
      address: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS || '5bKSQ9wpWmA4NxPfq3xiTv4Zpnzxjkfzm5WVwkL4Xrz3',
      explorer: 'https://solscan.io/tx/'
    },
    usdc: {
      currency: 'USDC',
      network: 'erc20',
      address: process.env.NEXT_PUBLIC_USDC_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
      explorer: 'https://etherscan.io/tx/'
    },
    usdt: {
      currency: 'USDT',
      network: 'erc20',
      address: process.env.NEXT_PUBLIC_USDT_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D97C3578b43Db34',
      explorer: 'https://etherscan.io/tx/'
    },
    xrp: {
      currency: 'XRP',
      network: 'xrpl',
      address: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS || 'rsptzf9RFKHjgvuNbjMGBLtkXp37nnEo8X',
      explorer: 'https://xrpscan.com/tx/',
      memo: process.env.NEXT_PUBLIC_XRP_DESTINATION_TAG || '123456'
    }
  };
};

// Get specific wallet address
export const getWalletAddress = (currency: string, network?: string): WalletInfo | null => {
  const wallets = getWalletAddresses();
  const key = currency.toLowerCase();

  if (wallets[key]) {
    return wallets[key];
  }

  return null;
};

// Copy address to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};