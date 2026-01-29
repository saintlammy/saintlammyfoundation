# Database Schema for Crypto Donations

## Current Schema (Supabase)

The `donations` table already supports comprehensive crypto donation tracking:

### Table: `donations`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `donor_id` | UUID | Foreign key to donors table |
| `category` | TEXT | Donation category (orphan, widow, home, general) |
| `amount` | DECIMAL | Amount in USD |
| `currency` | TEXT | Currency code (BTC, ETH, USDT, etc.) |
| `frequency` | TEXT | one-time, monthly, weekly, yearly |
| `payment_method` | TEXT | crypto, paypal, bank_transfer, card |
| `status` | TEXT | pending, completed, failed, refunded |
| `transaction_id` | TEXT | **Blockchain transaction hash** |
| `campaign_id` | UUID | Link to campaign if applicable |
| `notes` | JSONB | **Extended transaction details** |
| `source` | TEXT | Donation source/channel |
| `processed_at` | TIMESTAMP | When donation was completed |
| `created_at` | TIMESTAMP | When record was created |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Crypto Transaction Data Structure

For crypto donations, the `notes` JSONB field contains:

```json
{
  "network": "bitcoin|erc20|sol|bep20|trc20|xrpl",
  "cryptoAmount": 0.001234,
  "cryptoPrice": 45000.00,
  "walletAddress": "bc1q...",
  "memo": "12345678",
  "message": "Donor message",
  "source": "website",

  // Transaction details (NEW - captured upfront or during verification)
  "txHash": "abc123def456...",
  "senderAddress": "0x1234...",
  "blockHeight": 850000,
  "timestamp": "2025-01-29T12:00:00Z",
  "networkFee": 0.00001,

  // Verification details (added after blockchain verification)
  "verification": {
    "verified": true,
    "confirmations": 6,
    "verifiedAt": "2025-01-29T12:05:00Z",
    "actualAmount": 0.001234,
    "fromAddress": "0x1234...",
    "toAddress": "0x5678...",
    "blockHeight": 850000,
    "requiresManualReview": false,
    "error": null
  },

  // Metadata
  "createdVia": "donation-form",
  "submittedAt": "2025-01-29T11:55:00Z"
}
```

## Indexes Recommended for Performance

To optimize searches by transaction hash and improve query performance:

```sql
-- Index for transaction hash searches
CREATE INDEX idx_donations_transaction_id ON donations(transaction_id);

-- Index for crypto donations filtering
CREATE INDEX idx_donations_payment_method_status ON donations(payment_method, status);

-- GIN index for JSONB queries (for searching within notes)
CREATE INDEX idx_donations_notes_gin ON donations USING GIN (notes);

-- Composite index for crypto donation analytics
CREATE INDEX idx_crypto_donations ON donations(payment_method, status, created_at)
WHERE payment_method = 'crypto';
```

## Querying Transaction Details

### Find donation by transaction hash:
```sql
SELECT * FROM donations
WHERE transaction_id = 'abc123def456...';
```

### Find donations by sender address (JSONB query):
```sql
SELECT * FROM donations
WHERE notes->>'senderAddress' = '0x1234...'
  AND payment_method = 'crypto';
```

### Find unverified crypto donations:
```sql
SELECT * FROM donations
WHERE payment_method = 'crypto'
  AND status = 'pending'
  AND notes->'verification'->>'requiresManualReview' = 'true';
```

### Export crypto donations with full transaction details:
```sql
SELECT
  id,
  created_at,
  amount,
  currency,
  status,
  transaction_id,
  notes->>'senderAddress' as sender_address,
  notes->>'cryptoAmount' as crypto_amount,
  notes->>'network' as network,
  notes->'verification'->>'confirmations' as confirmations,
  notes->'verification'->>'verifiedAt' as verified_at
FROM donations
WHERE payment_method = 'crypto'
ORDER BY created_at DESC;
```

## No Migration Needed

The existing schema already supports all required fields:
- ✅ Transaction hash stored in `transaction_id`
- ✅ Sender address stored in `notes.senderAddress`
- ✅ Block height stored in `notes.blockHeight`
- ✅ Verification details stored in `notes.verification`
- ✅ All metadata stored in flexible JSONB `notes` field

The JSONB column provides flexibility to add new fields without schema changes.
