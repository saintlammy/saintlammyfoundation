/**
 * Official Organization Details
 * Saintlammy Community Care Initiative
 *
 * Updated: November 21, 2025
 */

export const ORGANIZATION_DETAILS = {
  // Legal Names
  legalName: 'Saintlammy Community Care Initiative',
  brandName: 'Saintlammy Foundation',

  // Registration
  cacRegistrationNumber: '9015713',
  taxIdNumber: '33715150-0001',
  registrationDate: '2025-11-21',
  registeredWith: 'Corporate Affairs Commission, Federal Republic of Nigeria',

  // Contact Information
  email: 'info@saintlammyfoundation.org',
  phone: '+234 XXX XXX XXXX',
  address: 'Lagos, Nigeria',

  // Website & Social
  website: 'https://saintlammyfoundation.org',

  // Banking (for receipts and transparency)
  bankName: '', // To be added
  accountNumber: '', // To be added
  accountName: 'Saintlammy Community Care Initiative',

  // Status
  entityType: 'Registered Nonprofit Organization',
  taxExemptStatus: true,

  // Crypto Wallets (for receipts)
  wallets: {
    bitcoin: process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS,
    ethereum: process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS,
    solana: process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS,
    tron: process.env.NEXT_PUBLIC_TRX_WALLET_ADDRESS,
    bnb: process.env.NEXT_PUBLIC_BNB_WALLET_ADDRESS,
    xrp: process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS,
  },

  // Mission Statement
  mission: 'To provide comprehensive support to widows, orphans, and vulnerable individuals across Nigeria through sustainable programs that address immediate needs while building long-term capacity for self-sufficiency.',

  // For Tax Receipts
  taxReceiptInfo: {
    organizationName: 'Saintlammy Community Care Initiative',
    registrationNumber: '9015713',
    taxId: '33715150-0001',
    taxExempt: true,
    receiptPrefix: 'SCCI-RCP',
    country: 'Nigeria',
    state: 'Lagos',
  }
} as const;

/**
 * Generate a receipt number for donations
 */
export function generateReceiptNumber(donationId?: string): string {
  const timestamp = Date.now();
  const idPart = donationId?.substring(0, 8) || Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${ORGANIZATION_DETAILS.taxReceiptInfo.receiptPrefix}-${timestamp}-${idPart}`;
}

/**
 * Get full legal disclaimer text
 */
export function getLegalDisclaimer(): string {
  return `${ORGANIZATION_DETAILS.legalName} is a registered nonprofit organization in Nigeria (CAC Registration: ${ORGANIZATION_DETAILS.cacRegistrationNumber}). Tax ID: ${ORGANIZATION_DETAILS.taxIdNumber}. All donations are tax-deductible to the extent permitted by law.`;
}

/**
 * Get formatted organization address for receipts
 */
export function getFormattedAddress(): string {
  return `${ORGANIZATION_DETAILS.legalName}
${ORGANIZATION_DETAILS.address}
Email: ${ORGANIZATION_DETAILS.email}
Phone: ${ORGANIZATION_DETAILS.phone}
CAC Reg: ${ORGANIZATION_DETAILS.cacRegistrationNumber}
Tax ID: ${ORGANIZATION_DETAILS.taxIdNumber}`;
}
