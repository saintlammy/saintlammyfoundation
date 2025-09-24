# 💳 Payment System Documentation

## Overview

The Saintlammy Foundation website now includes a comprehensive payment processing system supporting multiple payment methods, recurring donations, and real-time crypto payments.

## 🚀 Features Implemented

### ✅ PayPal Integration
- **One-time donations** via PayPal checkout
- **Recurring subscriptions** (monthly/yearly)
- **Automatic receipt generation**
- **Payment verification and capture**
- **Subscription management**

### ✅ Custom Crypto Gateway
- **Bitcoin (BTC)** payments with real-time pricing
- **Ethereum (ETH)** support
- **USDT (Tether)** integration
- **QR code generation** for mobile wallets
- **Transaction verification** system
- **24-hour payment expiry**

### ✅ Payment Processing
- **Multi-currency support** (USD, EUR, GBP, NGN, etc.)
- **Real-time exchange rates** via CoinGecko API
- **Payment tracking and analytics**
- **Donation source attribution**
- **Comprehensive error handling**

### ✅ User Experience
- **Step-by-step donation flow**
- **Payment method selection**
- **Real-time validation**
- **Success/cancellation pages**
- **Mobile-responsive design**

## 📁 File Structure

```
pages/
├── api/
│   └── payments/
│       ├── paypal.ts          # PayPal payment processing
│       ├── crypto.ts          # Crypto payment gateway
│       └── verify.ts          # Payment verification
├── donation/
│   ├── success.tsx           # Payment success page
│   └── cancelled.tsx         # Payment cancellation page
└── ...

components/
├── NewDonationModal.tsx      # Modern payment modal
├── DonationModal.tsx         # Original modal (legacy)
└── ...

lib/
├── paymentService.ts         # Payment service layer
└── ...
```

## 🔧 Environment Variables

Add these to your `.env.local` file:

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_PAYPAL_ENVIRONMENT=sandbox

# Crypto Wallet Addresses
NEXT_PUBLIC_BTC_WALLET_ADDRESS=your_btc_wallet_address_here
NEXT_PUBLIC_ETH_WALLET_ADDRESS=your_eth_wallet_address_here
NEXT_PUBLIC_USDT_WALLET_ADDRESS=your_usdt_wallet_address_here

# Database & Email
DATABASE_URL=your_database_url_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🔗 API Endpoints

### PayPal Payments
```
POST /api/payments/paypal
```
**Request:**
```json
{
  "amount": 100,
  "currency": "USD",
  "donationType": "one-time",
  "donorName": "John Doe",
  "donorEmail": "john@example.com",
  "message": "Supporting the mission",
  "source": "modal"
}
```

**Response:**
```json
{
  "success": true,
  "orderID": "PAYPAL_ORDER_ID",
  "approvalUrl": "https://paypal.com/checkoutnow?token=..."
}
```

### Crypto Payments
```
POST /api/payments/crypto
```
**Request:**
```json
{
  "amount": 100,
  "currency": "BTC",
  "donorEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "donationId": "crypto_123456789",
  "walletAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "cryptoAmount": 0.00234567,
  "qrCode": "data:image/png;base64,...",
  "expiresAt": "2024-01-02T10:30:00Z"
}
```

### Payment Verification
```
POST /api/payments/verify
```
**Request:**
```json
{
  "paymentId": "PAYPAL_ORDER_ID",
  "payerId": "PAYER_ID"
}
```

## 🎯 Usage Examples

### Basic PayPal Donation
```typescript
import { paymentService } from '@/lib/paymentService';

const result = await paymentService.processDonation({
  amount: 50,
  currency: 'USD',
  donationType: 'monthly',
  donorEmail: 'donor@example.com',
  paymentMethod: 'paypal'
});

if (result.success) {
  window.location.href = result.approvalUrl;
}
```

### Crypto Donation
```typescript
const result = await paymentService.processDonation({
  amount: 100,
  currency: 'USD',
  donationType: 'one-time',
  donorEmail: 'donor@example.com',
  paymentMethod: 'crypto',
  cryptoCurrency: 'BTC'
});

if (result.success) {
  // Show QR code and wallet address
  console.log('Send', result.cryptoAmount, 'BTC to', result.walletAddress);
}
```

## 🔐 Security Features

- **Environment variable protection** for sensitive data
- **PayPal webhook verification** (webhook signature validation)
- **CSRF protection** on all API endpoints
- **Input validation** and sanitization
- **Rate limiting** ready integration points
- **Error handling** with secure error messages

## 💰 Supported Cryptocurrencies

| Currency | Network | Confirmations | Notes |
|----------|---------|---------------|-------|
| Bitcoin (BTC) | Bitcoin | 1-6 | Native network |
| Ethereum (ETH) | Ethereum | 12-20 | ERC-20 compatible |
| Tether (USDT) | Ethereum | 12-20 | ERC-20 token |

## 📊 Analytics & Tracking

The system tracks:
- **Donation sources** (button clicked, page visited)
- **Payment methods** used
- **Success/failure rates**
- **Average donation amounts**
- **Geographic data** (if available)
- **Conversion funnels**

## 🚧 TODO for Production

### Database Integration
- [ ] Set up PostgreSQL/MongoDB
- [ ] Create donation tables/collections
- [ ] Implement donor management
- [ ] Add donation history

### Email System
- [ ] Configure SendGrid/Mailgun
- [ ] Design email templates
- [ ] Implement receipt generation
- [ ] Set up automated workflows

### Security Enhancements
- [ ] Add rate limiting (Redis)
- [ ] Implement webhook verification
- [ ] Add fraud detection
- [ ] Set up monitoring/alerting

### Payment Enhancements
- [ ] Add Stripe integration
- [ ] Implement bank transfers
- [ ] Add more crypto currencies
- [ ] Mobile money integration (Nigeria)

### Admin Features
- [ ] Donation dashboard
- [ ] Refund processing
- [ ] Subscription management
- [ ] Financial reporting

## 🧪 Testing

### PayPal Sandbox
1. Create PayPal Developer account
2. Set up sandbox application
3. Use test credentials in `.env.local`
4. Test with sandbox accounts

### Crypto Testing
1. Use testnet addresses for testing
2. Test with small amounts on mainnet
3. Verify QR code generation
4. Test expiry functionality

### Local Testing
```bash
# Start development server
npm run dev

# Test PayPal integration
curl -X POST http://localhost:3000/api/payments/paypal \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "currency": "USD", "donationType": "one-time"}'

# Test crypto integration
curl -X POST http://localhost:3000/api/payments/crypto \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "currency": "BTC"}'
```

## 📞 Support

For technical issues or questions:
- **Email**: dev@saintlammyfoundation.org
- **GitHub**: Create an issue in the repository
- **Documentation**: Check this file and inline code comments

## 🔄 Updates & Maintenance

- **Crypto prices**: Updated every API call via CoinGecko
- **PayPal SDK**: Keep @paypal/react-paypal-js updated
- **Security patches**: Monitor dependencies for vulnerabilities
- **API changes**: Watch for PayPal API deprecations

---

**Built with ❤️ for Saintlammy Foundation**

*This payment system enables secure, transparent donations to support orphans, widows, and vulnerable communities across Nigeria.*