# Quick API Setup - Fix Blockchain Calls

## Problem
Blockchain API calls are failing because no API keys are configured, causing:
- ❌ $NaN values in wallet dashboard
- ❌ Transaction verification errors (500 status)
- ❌ Rate limit exceeded errors
- ❌ Incomplete or missing blockchain data

## Solution
Configure free API keys for blockchain services.

## Quick Start (5-10 minutes total)

### 1. Etherscan (Ethereum) - 2 minutes
1. Go to: https://etherscan.io/register
2. Sign up → Verify email
3. Dashboard → API Keys → Add
4. Copy API key
5. Add to `.env.local`: `NEXT_PUBLIC_ETHERSCAN_API_KEY=your_key`

### 2. BscScan (Binance Smart Chain) - 2 minutes
1. Go to: https://bscscan.com/register
2. Sign up → Verify email
3. Dashboard → API Keys → Add
4. Copy API key
5. Add to `.env.local`: `NEXT_PUBLIC_BSCSCAN_API_KEY=your_key`

### 3. BlockCypher (Bitcoin) - 2 minutes
1. Go to: https://accounts.blockcypher.com/
2. Sign up → Verify email
3. Copy API token from dashboard
4. Add to `.env.local`: `NEXT_PUBLIC_BLOCKCYPHER_API_KEY=your_token`

### 4. TronGrid (Tron) - 2 minutes
1. Go to: https://www.trongrid.io/
2. Sign up → Verify email
3. API Keys → Create new key
4. Copy API key
5. Add to `.env.local`: `NEXT_PUBLIC_TRON_API_KEY=your_key`

### 5. Alchemy (Solana) - Optional but recommended - 3 minutes
1. Go to: https://www.alchemy.com/
2. Sign up → Create App → Select Solana Mainnet
3. Copy HTTPS endpoint
4. Add to `.env.local`: `NEXT_PUBLIC_SOLANA_RPC_URL=your_endpoint`

## Your .env.local File Should Look Like This:

```bash
# ... existing variables ...

# Blockchain API Keys
NEXT_PUBLIC_ETHERSCAN_API_KEY=ABC123DEF456GHI789
NEXT_PUBLIC_BSCSCAN_API_KEY=XYZ789ABC123DEF456
NEXT_PUBLIC_BLOCKCYPHER_API_KEY=blockcypher-token-here
NEXT_PUBLIC_TRON_API_KEY=trongrid-key-here
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-key
```

## Test Locally

```bash
# Restart dev server
npm run dev

# Then test:
# 1. Go to http://localhost:3000/admin/wallet-management
# 2. Click "Reload" button
# 3. Verify wallet balances display (no $NaN)
# 4. Check console for errors
```

## Deploy to Production (Netlify)

1. Go to: https://app.netlify.com
2. Select your site
3. **Site settings** → **Environment variables**
4. Add each variable:
   - `NEXT_PUBLIC_ETHERSCAN_API_KEY` = your key
   - `NEXT_PUBLIC_BSCSCAN_API_KEY` = your key
   - `NEXT_PUBLIC_BLOCKCYPHER_API_KEY` = your token
   - `NEXT_PUBLIC_TRON_API_KEY` = your key
   - `NEXT_PUBLIC_SOLANA_RPC_URL` = your endpoint (optional)
5. Save and redeploy

## Free Tier Limits (More Than Enough)

- ✅ **Etherscan**: 100,000 requests/day
- ✅ **BscScan**: 100,000 requests/day
- ✅ **BlockCypher**: 200 requests/hour
- ✅ **TronGrid**: 15,000 requests/day
- ✅ **Alchemy**: 300M compute units/month

## Expected Results After Setup

✅ Wallet dashboard shows real balances (no $NaN)
✅ Transaction verification works reliably
✅ Live blockchain data updates
✅ No rate limit errors (within free tier limits)

## Need More Details?

See [BLOCKCHAIN_API_SETUP.md](./BLOCKCHAIN_API_SETUP.md) for comprehensive documentation.

## Troubleshooting

**Still seeing $NaN?**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check API keys are correct (no spaces)
- Verify environment variable names match exactly

**Rate limit errors?**
- You're hitting limits (unlikely with free tiers)
- Check API dashboard for usage
- Consider longer cache duration

**"Invalid API key" errors?**
- Copy key again (no extra spaces)
- Verify key is active in API dashboard
- Restart dev server after adding keys

---

**Time to complete**: 10-15 minutes total
**Cost**: $0 (all free tiers)
**Impact**: Fixes all blockchain API issues ✅
