# Crypto Donation Transaction Tracking Enhancement

## Overview

Enhanced the crypto donation system to capture complete transaction information including transaction hash, sender address, block height, timestamp, and network fees. This enables full blockchain verification, transparency, and auditability for all crypto donations.

---

## Changes Made

### 1. **Enhanced Data Structures**

#### Updated Interface: `CryptoDonationData` ([lib/donationService.ts:12-32](lib/donationService.ts#L12))

```typescript
export interface CryptoDonationData {
  // Existing fields
  amount: number;
  currency: string;
  network: string;
  cryptoAmount: number;
  cryptoPrice: number;
  walletAddress: string;
  memo?: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  source?: string;
  category?: 'orphan' | 'widow' | 'home' | 'general';
  campaignId?: string;

  // NEW: Transaction details (can be provided upfront or added later)
  txHash?: string;              // Transaction hash
  senderAddress?: string;        // Sender's wallet address
  blockHeight?: number;          // Block number
  timestamp?: string;            // On-chain timestamp
  networkFee?: number;           // Transaction fee paid
}
```

#### Updated Schema Validation ([lib/schemas.ts:19-35](lib/schemas.ts#L19))

```typescript
export const CryptoDonationSchema = z.object({
  // ... existing fields ...

  // NEW: Transaction details validation
  txHash: z.string().min(10).max(256).optional(),
  senderAddress: z.string().min(10).max(256).optional(),
  blockHeight: z.number().positive().optional(),
  timestamp: z.string().datetime().optional(),
  networkFee: z.number().nonnegative().optional(),
});
```

---

### 2. **Enhanced Donation Storage**

#### Database Integration ([lib/donationService.ts:210-238](lib/donationService.ts#L210))

Now stores comprehensive transaction data in the `notes` JSONB field:

```typescript
notes: JSON.stringify({
  // Payment details
  network: donationData.network,
  cryptoAmount: donationData.cryptoAmount,
  cryptoPrice: donationData.cryptoPrice,
  walletAddress: donationData.walletAddress,
  memo: donationData.memo,
  message: donationData.message,
  source: donationData.source,

  // NEW: Transaction details
  txHash: donationData.txHash,
  senderAddress: donationData.senderAddress,
  blockHeight: donationData.blockHeight,
  timestamp: donationData.timestamp,
  networkFee: donationData.networkFee,

  // Metadata
  createdVia: 'donation-form',
  submittedAt: new Date().toISOString(),
})
```

Transaction hash also stored in `transaction_id` column for quick searches.

---

### 3. **Auto-Verification for Upfront Transactions**

#### Updated Crypto Payment API ([pages/api/payments/crypto.ts:453-495](pages/api/payments/crypto.ts#L453))

If a donor provides transaction hash when creating donation, the system:

1. ✅ Stores all transaction details immediately
2. ✅ Automatically verifies transaction on blockchain
3. ✅ Updates donation status to `completed` if verified
4. ✅ Marks for manual review if verification fails
5. ✅ Stores verification results in donation notes

```typescript
// If transaction hash was provided upfront, verify immediately
if (sanitizedData.txHash) {
  const verificationResult = await verifyTransaction(
    sanitizedData.txHash,
    sanitizedData.currency,
    cryptoAmount,
    walletAddress,
    network
  );

  if (verificationResult.isValid) {
    await donationService.updateDonationStatus(donationId, 'completed', sanitizedData.txHash);
    // Store full verification details...
  } else {
    // Mark for manual review...
  }
}
```

---

### 4. **Admin Search & Filter Enhancement**

#### Transaction Hash Search ([pages/admin/donations/index.tsx:544-556](pages/admin/donations/index.tsx#L544))

Admin can now search donations by:
- ✅ Donor name
- ✅ Donor email
- ✅ Transaction hash
- ✅ Sender wallet address
- ✅ Receiver wallet address
- ✅ PayPal order ID
- ✅ Reference number

```typescript
const matchesSearch =
  (donation.donor?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.donor?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.transactionHash || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.cryptoTxHash || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.cryptoAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (donation.paypalOrderId || '').toLowerCase().includes(searchTerm.toLowerCase());
```

Updated search placeholder: _"Search by name, email, tx hash, or wallet..."_

---

### 5. **Crypto Donation Export API**

#### New Endpoint: `/api/donations/export-crypto`

Exports all crypto donations with complete transaction and verification details.

**Query Parameters:**
- `format` - `csv` or `json` (default: csv)
- `status` - Filter by status (pending, completed, failed, refunded)
- `startDate` - Filter from date (ISO 8601)
- `endDate` - Filter to date (ISO 8601)

**Example Usage:**
```bash
# Export all completed crypto donations as CSV
GET /api/donations/export-crypto?format=csv&status=completed

# Export all crypto donations from January 2025 as JSON
GET /api/donations/export-crypto?format=json&startDate=2025-01-01
```

**CSV Columns (26 fields):**
1. Donation ID
2. Created At
3. Processed At
4. Status
5. Amount (USD)
6. Currency
7. Network
8. Crypto Amount
9. Crypto Price
10. **Transaction Hash**
11. **Sender Address**
12. **Receiver Address**
13. **Block Height**
14. **Timestamp**
15. **Network Fee**
16. Verified (Yes/No)
17. Confirmations
18. Verified At
19. Verified Amount
20. Requires Manual Review
21. Verification Error
22. Campaign ID
23. Memo
24. Message
25. Source
26. Category

**JSON Structure:**
```json
{
  "exportDate": "2025-01-29T12:00:00Z",
  "totalDonations": 42,
  "donations": [
    {
      "donationId": "abc-123",
      "createdAt": "2025-01-29T10:00:00Z",
      "status": "completed",
      "amount": 100,
      "currency": "BTC",
      "network": "bitcoin",
      "cryptoAmount": 0.00123,
      "txHash": "abc123def456...",
      "senderAddress": "bc1q...",
      "blockHeight": 850000,
      "verified": "Yes",
      "confirmations": 6,
      ...
    }
  ]
}
```

---

### 6. **Admin UI Export Button**

#### Export Feature ([pages/admin/donations/index.tsx:792-814](pages/admin/donations/index.tsx#L792))

Added "Export Crypto" button with dropdown menu:
- ✅ CSV (Spreadsheet) - for Excel/Google Sheets
- ✅ JSON (Raw Data) - for API integration/analysis

Respects current status filter (pending, completed, failed, etc.)

---

## Database Schema

### No Migration Required! ✅

The existing `donations` table already supports all required fields:

| Column | Use for Crypto Donations |
|--------|-------------------------|
| `transaction_id` | Transaction hash |
| `notes` (JSONB) | All transaction & verification details |
| `status` | pending → completed after verification |
| `processed_at` | Timestamp when verified |

**Recommended Indexes for Performance:**

```sql
-- Quick transaction hash lookups
CREATE INDEX idx_donations_transaction_id ON donations(transaction_id);

-- Crypto donation filtering
CREATE INDEX idx_crypto_donations ON donations(payment_method, status, created_at)
WHERE payment_method = 'crypto';

-- JSONB queries (sender address, verification data)
CREATE INDEX idx_donations_notes_gin ON donations USING GIN (notes);
```

See [DATABASE_SCHEMA_NOTES.md](DATABASE_SCHEMA_NOTES.md) for full details.

---

## Benefits

### For Transparency & Auditability
- ✅ Every crypto donation linked to on-chain transaction
- ✅ Complete audit trail with sender addresses
- ✅ Verifiable on public blockchains
- ✅ Export reports for financial audits

### For Operations
- ✅ Quick reconciliation with blockchain records
- ✅ Search donations by transaction hash
- ✅ Identify pending/failed transactions
- ✅ Manual review workflow for unverified donations

### For Donors
- ✅ Can provide transaction hash upfront for instant verification
- ✅ Transparent record of their donation
- ✅ Receipt with blockchain proof

---

## Usage Examples

### 1. **Donor Already Sent Payment**

When a donor has already sent crypto before filling the form:

```typescript
POST /api/payments/crypto
{
  "amount": 100,
  "currency": "BTC",
  "network": "bitcoin",
  "donorName": "John Doe",
  "donorEmail": "john@example.com",

  // Already sent - provide transaction details
  "txHash": "abc123def456...",
  "senderAddress": "bc1qxyz...",
  "timestamp": "2025-01-29T10:00:00Z"
}
```

System will:
1. Store donation with all details
2. Verify transaction on Bitcoin blockchain
3. Auto-complete if verified
4. Send receipt to donor

---

### 2. **Search by Transaction Hash**

Admin searches: `abc123def456`

Finds donation with matching:
- Transaction ID (main field)
- Notes.txHash
- Notes.verification.txHash

---

### 3. **Export Unverified Donations**

```bash
GET /api/donations/export-crypto?status=pending&format=csv
```

Returns CSV with all pending crypto donations showing:
- Which ones require manual review
- Verification errors
- Sender addresses for manual verification

---

## Testing Checklist

- [ ] Create donation without transaction hash (traditional flow)
- [ ] Create donation with transaction hash (auto-verify flow)
- [ ] Search by transaction hash in admin panel
- [ ] Search by sender wallet address
- [ ] Export crypto donations as CSV
- [ ] Export crypto donations as JSON
- [ ] Verify CSV contains all 26 columns
- [ ] Check manual review workflow for failed verifications
- [ ] Test filters (status, date range) on export

---

## Future Enhancements

- [ ] Real-time webhook notifications when transactions confirmed
- [ ] Donor dashboard to view their crypto donation history
- [ ] Automatic retry for failed verifications
- [ ] Support for EIP-681 payment URIs (Ethereum)
- [ ] Integration with tax receipt generation
- [ ] Multi-signature wallet support

---

## Updated: January 29, 2025

**Files Modified:**
- `lib/donationService.ts` - Enhanced interface and storage
- `lib/schemas.ts` - Added validation for transaction fields
- `pages/api/payments/crypto.ts` - Auto-verification for upfront transactions
- `pages/admin/donations/index.tsx` - Enhanced search and export UI

**Files Created:**
- `pages/api/donations/export-crypto.ts` - Export API endpoint
- `DATABASE_SCHEMA_NOTES.md` - Database documentation
- `CRYPTO_DONATION_ENHANCEMENT.md` - This document
