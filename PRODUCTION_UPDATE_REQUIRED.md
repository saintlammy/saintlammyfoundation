# Production Update Required

## Critical: Update Netlify Environment Variables

The wallet addresses in your Netlify environment variables are **INCORRECT** and need to be updated immediately.

### Current Issue
Production is showing the wrong wallet address: `0x742d35Cc6634C0532925a3b8D97C3578b43Db34`
This address was rejected by Trust Wallet and you cannot access funds sent to it.

### Required Updates

Go to: **Netlify Dashboard → Your Site → Site Settings → Environment Variables**

Update these **4 variables**:

```bash
NEXT_PUBLIC_USDT_ETH_ADDRESS=0x284510028B1De5e9469b2392a2824dA2fa4A6063
NEXT_PUBLIC_USDT_BSC_ADDRESS=0xb51271A11F107A37523045Ee267D9232B867bd11
NEXT_PUBLIC_USDC_ETH_ADDRESS=0x284510028B1De5e9469b2392a2824dA2fa4A6063
NEXT_PUBLIC_USDC_BSC_ADDRESS=0xb51271A11F107A37523045Ee267D9232B867bd11
```

### After Updating

1. **Redeploy** your site on Netlify (it should auto-deploy from the latest git push)
2. **Test** a crypto donation to verify the correct address is showing
3. **Verify** the wallet address matches: `0xb51271A11F107A37523045Ee267D9232B867bd11` for BSC/BNB

## Recent Code Changes (Already Pushed to GitHub)

### Commit 1: fa2ebc4 - Fix Incorrect Wallet Addresses
- Updated `.env.local` with correct addresses
- Updated fallback addresses in `pages/api/payments/crypto.ts`
- Updated fallback addresses in `lib/walletConfig.ts`

### Commit 2: 483d8d1 - Update Documentation
- Updated `NETLIFY_ENV_VARS.md` with correct addresses

### Commit 3: 967d696 - Improve Error Handling
- Fixed transaction verification 500 errors
- Added graceful fallback when BSCScan API key not configured
- All failed automatic verifications now marked for manual review
- Better user experience - no blocking errors

## Transaction Verification Improvements

### What Changed
Previously, when automatic blockchain verification failed (due to missing API keys or API errors), users would see a **500 error** and couldn't complete their donation.

Now:
- ✅ Transactions are accepted even if automatic verification fails
- ✅ User sees: "Transaction submitted successfully. Our team will verify it shortly."
- ✅ Donation is marked for manual review in admin dashboard
- ✅ No blocking 500 errors

### For Production (Optional but Recommended)

To enable automatic blockchain verification, add these API keys to Netlify:

```bash
BSCSCAN_API_KEY=your_bscscan_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

Get free API keys:
- BSCScan: https://bscscan.com/apis
- Etherscan: https://etherscan.io/apis

**Without these keys**: Transactions still work, but require manual verification in admin dashboard.

## Testing Checklist

After updating Netlify environment variables:

- [ ] Production site redeployed
- [ ] Wallet address for USDT BSC shows: `0xb51271A11F107A37523045Ee267D9232B867bd11`
- [ ] Test donation flow - should show correct address
- [ ] Submit test transaction hash - should not show 500 error
- [ ] Check admin dashboard - donation should appear with manual review flag

## Status

- ✅ Code fixed and pushed to GitHub
- ✅ Local environment working correctly
- ⚠️ **Netlify environment variables need manual update**
- ⚠️ **Production deployment needed**

## Quick Links

- Netlify Dashboard: https://app.netlify.com
- Repository: https://github.com/saintlammy/saintlammyfoundation
- Latest Commits: fa2ebc4, 483d8d1, 967d696
