# Blockchain API Setup Guide

This guide explains how to obtain and configure blockchain API keys to ensure reliable blockchain data fetching.

## Why API Keys Are Required

Without proper API keys, blockchain services will:
- Hit rate limits quickly
- Return errors or incomplete data
- Show $NaN values in the wallet dashboard
- Fail transaction verification

## Required API Keys

### 1. Etherscan API Key (Ethereum Network)

**Purpose**: Fetch Ethereum wallet balances, transactions, and ERC-20 token data (USDT, USDC on Ethereum)

**Steps**:
1. Go to https://etherscan.io/apis
2. Click "Register" and create a free account
3. Verify your email
4. Go to "API Keys" in your dashboard
5. Click "Add" to create a new API key
6. Copy the API key

**Free Tier**: 100,000 requests/day (5 requests/second)

**Add to .env.local**:
```bash
NEXT_PUBLIC_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_HERE
```

**Netlify Environment Variable**: `NEXT_PUBLIC_ETHERSCAN_API_KEY`

---

### 2. BscScan API Key (Binance Smart Chain)

**Purpose**: Fetch BSC wallet balances, transactions, and BEP-20 token data (USDT, USDC on BSC)

**Steps**:
1. Go to https://bscscan.com/apis
2. Click "Register" and create a free account
3. Verify your email
4. Go to "API Keys" in your dashboard
5. Click "Add" to create a new API key
6. Copy the API key

**Free Tier**: 100,000 requests/day (5 requests/second)

**Add to .env.local**:
```bash
NEXT_PUBLIC_BSCSCAN_API_KEY=YOUR_BSCSCAN_API_KEY_HERE
```

**Netlify Environment Variable**: `NEXT_PUBLIC_BSCSCAN_API_KEY`

---

### 3. BlockCypher API Key (Bitcoin Network)

**Purpose**: Fetch Bitcoin wallet balances, transactions, and blockchain data

**Steps**:
1. Go to https://accounts.blockcypher.com/
2. Sign up with your email
3. Verify your email
4. Go to your dashboard
5. Copy your API token

**Free Tier**: 200 requests/hour (3 requests/second burst)

**Add to .env.local**:
```bash
NEXT_PUBLIC_BLOCKCYPHER_API_KEY=YOUR_BLOCKCYPHER_TOKEN_HERE
```

**Netlify Environment Variable**: `NEXT_PUBLIC_BLOCKCYPHER_API_KEY`

**Note**: BlockCypher works without API key but with severe rate limits (3 requests/second, 200/hour). With a token, you get higher limits.

---

### 4. TronGrid API Key (Tron Network)

**Purpose**: Fetch Tron wallet balances, transactions, and TRC-20 token data

**Steps**:
1. Go to https://www.trongrid.io/
2. Click "Sign Up" and create an account
3. Verify your email
4. Go to "API Keys" section
5. Create a new API key
6. Copy the API key

**Free Tier**: 15,000 requests/day

**Add to .env.local**:
```bash
NEXT_PUBLIC_TRON_API_KEY=YOUR_TRONGRID_API_KEY_HERE
```

**Netlify Environment Variable**: `NEXT_PUBLIC_TRON_API_KEY`

---

### 5. Solana RPC Endpoint (Solana Network)

**Purpose**: Fetch Solana wallet balances, SPL tokens (USDT, USDC on Solana)

**Current Setup**: Using public RPC `https://api.mainnet-beta.solana.com` (rate limited)

**Recommended Upgrade Options**:

#### Option A: Alchemy (Recommended)
1. Go to https://www.alchemy.com/
2. Sign up for free account
3. Create a new app → Select "Solana" → "Mainnet"
4. Copy the HTTPS endpoint

**Free Tier**: 300M compute units/month

**Add to .env.local**:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

#### Option B: QuickNode
1. Go to https://www.quicknode.com/
2. Sign up for free account
3. Create endpoint → Select "Solana Mainnet"
4. Copy the HTTPS endpoint

**Free Tier**: 10M requests/month

**Add to .env.local**:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_TOKEN/
```

**Netlify Environment Variable**: `NEXT_PUBLIC_SOLANA_RPC_URL`

---

### 6. XRP Ledger (XRP Network)

**Current Setup**: Using XRPScan public API `https://api.xrpscan.com` (no key required)

**Status**: ✅ Working without API key

**Alternative for Production**: Consider using official XRPL servers for better reliability
- Public cluster: `wss://xrplcluster.com`
- Ripple's public server: `wss://s1.ripple.com`

**Optional Add to .env.local**:
```bash
NEXT_PUBLIC_XRPL_SERVER=wss://xrplcluster.com
```

---

## Summary Checklist

Add these to your `.env.local` file:

```bash
# Blockchain API Keys
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_BSCSCAN_API_KEY=your_bscscan_api_key
NEXT_PUBLIC_BLOCKCYPHER_API_KEY=your_blockcypher_token
NEXT_PUBLIC_TRON_API_KEY=your_trongrid_api_key
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your_alchemy_key
```

## Adding to Netlify Production

After adding keys to `.env.local`, you must also add them to Netlify:

1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable one by one:
   - Key: `NEXT_PUBLIC_ETHERSCAN_API_KEY`
   - Value: `your_etherscan_api_key`
   - Click **Save**
6. Repeat for all 5 API keys
7. Trigger a new deployment (Netlify may auto-deploy)

## Testing API Keys

After adding the keys, test them locally:

```bash
npm run dev
```

Then:
1. Go to http://localhost:3000/admin/wallet-management
2. Click the "Reload" button
3. Verify wallet balances display correctly (no $NaN)
4. Check browser console for any API errors

## Rate Limits Summary

| Service | Free Tier | Rate Limit | Upgrade Cost |
|---------|-----------|------------|--------------|
| Etherscan | 100K req/day | 5 req/sec | $49-$199/mo |
| BscScan | 100K req/day | 5 req/sec | $49-$199/mo |
| BlockCypher | 200 req/hour | 3 req/sec | $50-$500/mo |
| TronGrid | 15K req/day | Variable | Contact sales |
| Alchemy (Solana) | 300M CU/mo | Variable | $49-$499/mo |
| QuickNode (Solana) | 10M req/mo | Variable | $9-$299/mo |

## Best Practices

1. **Never commit API keys to Git** - Always use environment variables
2. **Rotate keys regularly** - Change keys every 3-6 months
3. **Monitor usage** - Check dashboards to avoid hitting limits
4. **Use caching** - Current implementation caches prices for 1 minute
5. **Implement fallbacks** - Code already handles API failures gracefully

## Troubleshooting

### Issue: Still seeing $NaN after adding keys

**Solution**:
1. Restart your dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache and reload
3. Check console for errors
4. Verify environment variables loaded: `console.log(process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY)`

### Issue: "Rate limit exceeded" errors

**Solution**:
1. Check API dashboard for usage
2. Implement longer caching (increase CACHE_DURATION in blockchainService.ts)
3. Reduce refresh frequency in wallet dashboard
4. Consider upgrading to paid tier

### Issue: "Invalid API key" errors

**Solution**:
1. Verify key copied correctly (no extra spaces)
2. Check key is active in API dashboard
3. Verify environment variable name matches exactly
4. Restart dev server after adding keys

## Support

- Etherscan Support: https://docs.etherscan.io/
- BscScan Support: https://docs.bscscan.com/
- BlockCypher Support: https://www.blockcypher.com/dev/
- TronGrid Support: https://developers.tron.network/
- Alchemy Support: https://docs.alchemy.com/
- QuickNode Support: https://www.quicknode.com/docs

---

Last Updated: September 27, 2025
