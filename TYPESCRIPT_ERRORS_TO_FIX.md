# TypeScript Errors to Fix - Priority Guide

## Summary
**Total Errors:** 124+ TypeScript errors revealed after enabling strict type checking

These errors were previously hidden by `ignoreBuildErrors: true` in next.config.js.

---

## Error Categories (Prioritized)

### 🔴 **HIGH PRIORITY** - Blocking Production (34 errors)

#### 1. Missing Function Definitions (6 errors)
**File:** `pages/admin/content/testimonials.tsx`
**Lines:** 427, 450, 458, 538, 603, 612

**Problem:** Functions `addTestimonial`, `updateTestimonial`, `deleteTestimonial` are not defined

**Fix:**
```typescript
// Add these functions at the top of the file
const addTestimonial = async (data: any) => {
  // Implementation
};

const updateTestimonial = async (id: string, data: any) => {
  // Implementation
};

const deleteTestimonial = async (id: string) => {
  // Implementation
};
```

---

#### 2. Supabase Null Checks (12 errors)
**Files:**
- `pages/api/admin/cookie-analytics.ts` (8 errors)
- Various API routes

**Problem:** `supabase` is possibly 'null' - not checking before use

**Fix:**
```typescript
// Before
const { data } = await supabase.from('table').select();

// After
if (!supabase) {
  return res.status(500).json({ error: 'Database not available' });
}
const { data } = await supabase.from('table').select();
```

---

#### 3. Supabase Type Mismatches (16 errors)
**Files:**
- `pages/api/campaign-share.ts`
- `pages/api/campaigns.ts`
- `pages/api/content/*.ts`

**Problem:** Supabase returns 'never' type - database schema mismatch

**Cause:** Database types in `types/database.ts` don't match actual schema

**Fix Options:**
1. **Regenerate types from Supabase:**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
   ```

2. **Or add type assertions:**
   ```typescript
   const { data } = await supabase
     .from('campaigns')
     .insert(campaignData as any); // Temporary fix
   ```

---

### 🟡 **MEDIUM PRIORITY** - Code Quality (45 errors)

#### 4. Implicit 'any' Types (25 errors)
**Files:**
- `pages/admin/analytics/*.tsx` (15 errors)
- `pages/admin/index.tsx` (3 errors)
- `pages/admin/wallet-management/index.tsx` (2 errors)
- `pages/api/admin/stats.ts` (5 errors)

**Problem:** Parameters without explicit types

**Example Fix:**
```typescript
// Before
data.map((entry, index) => ...)

// After
data.map((entry: DataEntry, index: number) => ...)
```

---

#### 5. Type Mismatches - Phone Fields (2 errors)
**File:** `pages/admin/partnerships/index.tsx`
**Lines:** 97, 121

**Problem:** `phone: string | undefined` doesn't match `phone: string`

**Fix:**
```typescript
// Option 1: Make phone optional in type definition
interface PartnershipApplication {
  phone?: string;  // Add ?
}

// Option 2: Provide default value
phone: data.phone || '',
```

---

#### 6. Chart Data Type Mismatches (2 errors)
**Files:**
- `pages/admin/analytics/donations.tsx:457`
- `pages/admin/analytics/website.tsx:374`

**Problem:** Custom data types don't have string index signature

**Fix:**
```typescript
// Add index signature to types
interface PaymentMethodData {
  [key: string]: any;  // Add this
  method: string;
  count: number;
  // ... other fields
}
```

---

### 🟢 **LOW PRIORITY** - Nice to Have (45 errors)

#### 7. Library Type Issues (3 errors)
**Files:**
- `components/CampaignQRModal.tsx` - QRCode.toCanvas missing
- `lib/wallet.ts` - Missing Keypair, TronWeb, Client imports

**Fix:**
```typescript
// CampaignQRModal.tsx - Use correct QRCode method
import * as QRCode from 'qrcode';

// Change from
QRCode.toCanvas(...)

// To
QRCode.toDataURL(...) // or QRCode.toString(...)

// lib/wallet.ts - Add imports
import { Keypair } from '@solana/web3.js';
import TronWeb from 'tronweb';
import { Client } from 'xrpl';
```

---

#### 8. Enum/Union Type Mismatches (4 errors)
**Files:**
- `components/Layout.tsx:34` - "navigation" not in CookieCategory type
- `components/UrgentNeeds.tsx:174` - "general" not in allowed categories
- `pages/about.tsx:338` - "about-page" not in CookieCategory

**Fix:**
```typescript
// Update type definitions to include missing values
type CookieCategory =
  | "navigation"  // Add this
  | "about-page"  // Add this
  | "general"
  | "footer"
  // ... existing values
```

---

#### 9. Query Parameter Type Safety (7 errors)
**File:** `pages/api/content/index.ts`

**Problem:** `req.query.param` is `string | string[]` but expecting `string`

**Fix:**
```typescript
// Before
const id = req.query.id;

// After
const id = Array.isArray(req.query.id)
  ? req.query.id[0]
  : req.query.id || '';
```

---

#### 10. Netlify Function Issues (3 errors)
**File:** `netlify/functions/scheduled-crypto-monitor.ts`

**Problem:**
- Wrong number of arguments to `verifyTransaction`
- Property 'verified' doesn't exist (should be 'isValid')
- Property 'transactionHash' missing

**Fix:**
```typescript
// Line 54 - Add missing currency parameter
const verification = await blockchainVerification.verifyTransaction(
  txHash,
  network,
  expectedAmount,
  walletAddress,
  currency  // ADD THIS
);

// Line 61 - Change verified to isValid
if (verification.isValid) {  // CHANGE THIS

// Line 67 - Use correct property
const hash = verification.txHash || txHash;  // FIX PROPERTY NAME
```

---

#### 11. Admin Donations API (1 error)
**File:** `pages/api/admin/donations.ts:71`

**Problem:** Property 'manualConfirmation' doesn't exist

**Fix:**
```typescript
// Remove or add to type definition
await donationService.updateDonationNotes(donationId, {
  txHash,
  confirmations,
  // ... other fields
  // Remove: manualConfirmation: true,
});
```

---

#### 12. Unknown Types (3 errors)
**File:** `pages/api/admin/stats.ts`

**Problem:** Variables of type 'unknown'

**Fix:**
```typescript
// Add type assertions
const percent = (data.percent as number);
const total = (stats.totalCompletedDonations as number);
```

---

## Quick Win: Batch Fixes

### Fix all implicit 'any' types at once:
```bash
# Find all implicit any errors
npm run typecheck 2>&1 | grep "TS7006" | cut -d'(' -f1 | sort | uniq

# Then add types to each parameter
```

### Fix all Supabase null checks:
```bash
# Search for all supabase usage without null check
grep -r "supabase.from" pages/api --include="*.ts" | grep -v "if (!supabase)"
```

---

## Recommended Fix Order

1. ✅ **Start Here:** Fix testimonials.tsx missing functions (Quick, blocks feature)
2. ✅ **Then:** Add Supabase null checks (Security, prevents crashes)
3. ✅ **Then:** Fix Netlify function args (Blocks crypto monitoring)
4. ⏭️ **Later:** Fix implicit 'any' types (Code quality, not blocking)
5. ⏭️ **Later:** Regenerate Supabase types (Big task, do when ready)
6. ⏭️ **Last:** Fix enum mismatches and library issues (Minor, cosmetic)

---

## Testing After Fixes

```bash
# Run type check
npm run typecheck

# Run build
npm run build

# Check specific file
npx tsc --noEmit pages/admin/content/testimonials.tsx
```

---

## Need Help?

If you want me to fix any specific category, just ask! For example:
- "Fix all missing function definitions"
- "Fix all Supabase null checks"
- "Fix implicit any types in admin/analytics"

---

**Pro Tip:** Fix errors file-by-file rather than all at once. Start with files that have the most errors.

**Files with Most Errors:**
1. `pages/api/content/index.ts` - 12 errors
2. `pages/api/content/revisions.ts` - 18 errors
3. `pages/api/admin/stats.ts` - 15 errors
4. `pages/api/admin/cookie-analytics.ts` - 12 errors
5. `pages/admin/content/testimonials.tsx` - 6 errors

---

**Last Updated:** January 14, 2026
**Total Errors Found:** 124+
**Errors Fixed:** 0 (Ready to start!)
