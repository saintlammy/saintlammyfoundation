import { z } from 'zod';

/**
 * Environment Variable Validation
 * SECURITY: Validates all required environment variables at runtime
 * Fails fast if critical configuration is missing
 */

// Define the schema for all environment variables
const envSchema = z.object({
  // Supabase Configuration (Required for database)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key required').optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Crypto Wallet Addresses (Required for donations)
  NEXT_PUBLIC_BTC_WALLET_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_ETH_WALLET_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
  NEXT_PUBLIC_BNB_WALLET_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid BNB address').optional(),
  NEXT_PUBLIC_SOL_WALLET_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_TRX_WALLET_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_XRP_WALLET_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_XRP_DESTINATION_TAG: z.string().optional(),

  // Token wallet addresses
  NEXT_PUBLIC_USDT_SOL_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_USDT_ETH_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_USDT_BSC_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_USDT_TRC_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_USDC_SOL_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_USDC_ETH_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_USDC_BSC_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_USDC_TRC_ADDRESS: z.string().optional(),

  // Blockchain API Keys (Optional but recommended)
  NEXT_PUBLIC_ETHERSCAN_API_KEY: z.string().optional(),
  NEXT_PUBLIC_BSCSCAN_API_KEY: z.string().optional(),
  NEXT_PUBLIC_TRON_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().optional(),
  NEXT_PUBLIC_BLOCKCYPHER_API_KEY: z.string().optional(),

  // Other configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates environment variables against the schema
 */
export function validateEnv(): {
  success: boolean;
  errors?: string[];
  warnings?: string[];
  config?: EnvConfig;
} {
  try {
    const config = envSchema.parse(process.env);

    const warnings: string[] = [];

    // Check for missing optional but important configs
    if (!config.NEXT_PUBLIC_SUPABASE_URL) {
      warnings.push('⚠️  NEXT_PUBLIC_SUPABASE_URL not set - database features will not work');
    }

    if (!config.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      warnings.push('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not set - database features will not work');
    }

    // Check for missing wallet addresses
    const cryptoWallets = [
      'NEXT_PUBLIC_BTC_WALLET_ADDRESS',
      'NEXT_PUBLIC_ETH_WALLET_ADDRESS',
      'NEXT_PUBLIC_BNB_WALLET_ADDRESS',
      'NEXT_PUBLIC_SOL_WALLET_ADDRESS',
      'NEXT_PUBLIC_TRX_WALLET_ADDRESS',
      'NEXT_PUBLIC_XRP_WALLET_ADDRESS',
    ];

    const missingWallets = cryptoWallets.filter(key => !process.env[key]);
    if (missingWallets.length > 0) {
      warnings.push(`⚠️  Missing wallet addresses: ${missingWallets.join(', ')} - crypto donations will be limited`);
    }

    // Check for missing blockchain API keys
    if (!config.NEXT_PUBLIC_ETHERSCAN_API_KEY) {
      warnings.push('⚠️  NEXT_PUBLIC_ETHERSCAN_API_KEY not set - Ethereum transaction verification may be limited');
    }

    if (!config.NEXT_PUBLIC_SOLANA_RPC_URL) {
      warnings.push('⚠️  NEXT_PUBLIC_SOLANA_RPC_URL not set - using default public RPC (may be rate limited)');
    }

    return {
      success: true,
      config,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `❌ ${err.path.join('.')}: ${err.message}`);
      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: ['❌ Unknown error validating environment variables'],
    };
  }
}

/**
 * Validates that critical crypto wallet addresses are configured
 * before allowing crypto payment requests
 */
export function validateCryptoConfig(currency: string, network: string): {
  valid: boolean;
  error?: string;
} {
  const walletVarMap: Record<string, string> = {
    'BTC-bitcoin': 'NEXT_PUBLIC_BTC_WALLET_ADDRESS',
    'ETH-erc20': 'NEXT_PUBLIC_ETH_WALLET_ADDRESS',
    'BNB-bep20': 'NEXT_PUBLIC_BNB_WALLET_ADDRESS',
    'SOL-sol': 'NEXT_PUBLIC_SOL_WALLET_ADDRESS',
    'TRX-trc20': 'NEXT_PUBLIC_TRX_WALLET_ADDRESS',
    'XRP-xrpl': 'NEXT_PUBLIC_XRP_WALLET_ADDRESS',
    'USDT-sol': 'NEXT_PUBLIC_USDT_SOL_ADDRESS',
    'USDT-erc20': 'NEXT_PUBLIC_USDT_ETH_ADDRESS',
    'USDT-bep20': 'NEXT_PUBLIC_USDT_BSC_ADDRESS',
    'USDT-trc20': 'NEXT_PUBLIC_USDT_TRC_ADDRESS',
    'USDC-sol': 'NEXT_PUBLIC_USDC_SOL_ADDRESS',
    'USDC-erc20': 'NEXT_PUBLIC_USDC_ETH_ADDRESS',
    'USDC-bep20': 'NEXT_PUBLIC_USDC_BSC_ADDRESS',
    'USDC-trc20': 'NEXT_PUBLIC_USDC_TRC_ADDRESS',
  };

  const key = `${currency}-${network}`;
  const envVar = walletVarMap[key];

  if (!envVar) {
    return {
      valid: false,
      error: `Unsupported currency/network combination: ${currency} on ${network}`,
    };
  }

  const address = process.env[envVar];
  if (!address) {
    return {
      valid: false,
      error: `Wallet address not configured for ${currency} on ${network}. Please contact administrator.`,
    };
  }

  return { valid: true };
}

/**
 * Logs environment validation status on startup
 * Call this in _app.tsx or API middleware
 */
export function logEnvStatus() {
  if (process.env.NODE_ENV === 'development') {
    console.log('\n🔍 Validating Environment Configuration...\n');
    const validation = validateEnv();

    if (validation.success) {
      console.log('✅ Environment validation passed\n');
      if (validation.warnings) {
        validation.warnings.forEach(warning => console.warn(warning));
      }
    } else {
      console.error('❌ Environment validation failed:\n');
      validation.errors?.forEach(error => console.error(error));
      console.error('\n⚠️  Application may not function correctly!\n');
    }
  }
}

// Export a function to get validated config
export function getEnvConfig(): EnvConfig {
  const validation = validateEnv();
  if (!validation.success) {
    throw new Error('Environment validation failed: ' + validation.errors?.join(', '));
  }
  return validation.config!;
}
