import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const PAYPAL_API_BASE = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

interface DonationRequest {
  amount: number;
  currency: string;
  donationType: 'one-time' | 'monthly' | 'yearly';
  donorName?: string;
  donorEmail?: string;
  message?: string;
  source?: string;
  category?: string;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('PayPal token error:', error);
    throw new Error('Failed to get PayPal access token');
  }
}

async function createPayPalOrder(donationData: DonationRequest, accessToken: string): Promise<PayPalOrderResponse> {
  const { amount, currency, donationType, donorName, donorEmail, message, source } = donationData;

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: `DONATION_${Date.now()}`,
      description: `Donation to Saintlammy Foundation - ${donationType}`,
      custom_id: JSON.stringify({
        donationType,
        source,
        donorName,
        donorEmail,
        message,
        timestamp: new Date().toISOString()
      }),
      amount: {
        currency_code: currency,
        value: amount.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: currency,
            value: amount.toFixed(2)
          }
        }
      },
      items: [{
        name: `${donationType} donation to Saintlammy Foundation`,
        description: message || 'Supporting orphans, widows, and vulnerable communities',
        unit_amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        },
        quantity: '1',
        category: 'DONATION'
      }]
    }],
    application_context: {
      brand_name: 'Saintlammy Foundation',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXTAUTH_URL}/donation/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/donation/cancelled`
    }
  };

  try {
    const response = await axios.post(`${PAYPAL_API_BASE}/v2/checkout/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw new Error('Failed to create PayPal order');
  }
}

async function createRecurringSubscription(donationData: DonationRequest, accessToken: string) {
  const { amount, currency, donationType, donorName, donorEmail } = donationData;

  // Create product first
  const productData = {
    name: 'Saintlammy Foundation Recurring Donation',
    description: 'Monthly/Yearly recurring donation to support our mission',
    type: 'SERVICE',
    category: 'NON_PROFIT'
  };

  try {
    const productResponse = await axios.post(`${PAYPAL_API_BASE}/v1/catalogs/products`, productData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const productId = productResponse.data.id;

    // Create billing plan
    const planData = {
      product_id: productId,
      name: `${donationType} Donation Plan`,
      description: `${donationType} recurring donation to Saintlammy Foundation`,
      billing_cycles: [{
        frequency: {
          interval_unit: donationType === 'monthly' ? 'MONTH' : 'YEAR',
          interval_count: 1
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // Infinite
        pricing_scheme: {
          fixed_price: {
            value: amount.toFixed(2),
            currency_code: currency
          }
        }
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: currency
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    };

    const planResponse = await axios.post(`${PAYPAL_API_BASE}/v1/billing/plans`, planData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const planId = planResponse.data.id;

    // Create subscription
    const subscriptionData = {
      plan_id: planId,
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
      subscriber: {
        name: {
          given_name: donorName?.split(' ')[0] || 'Anonymous',
          surname: donorName?.split(' ').slice(1).join(' ') || 'Donor'
        },
        email_address: donorEmail || 'donor@example.com'
      },
      application_context: {
        brand_name: 'Saintlammy Foundation',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: `${process.env.NEXTAUTH_URL}/donation/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/donation/cancelled`
      }
    };

    const subscriptionResponse = await axios.post(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, subscriptionData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return subscriptionResponse.data;
  } catch (error) {
    console.error('PayPal subscription creation error:', error);
    throw new Error('Failed to create PayPal subscription');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const donationData: DonationRequest = req.body;

    // Validate required fields
    if (!donationData.amount || !donationData.currency || !donationData.donationType) {
      return res.status(400).json({
        error: 'Missing required fields: amount, currency, donationType'
      });
    }

    // Validate amount
    if (donationData.amount < 1) {
      return res.status(400).json({
        error: 'Minimum donation amount is 1.00'
      });
    }

    const accessToken = await getPayPalAccessToken();

    if (donationData.donationType === 'one-time') {
      // Create one-time payment order
      const order = await createPayPalOrder(donationData, accessToken);

      // Store donation attempt in database (you'll implement this)
      // await storeDonationAttempt({...donationData, paypalOrderId: order.id});

      return res.status(200).json({
        success: true,
        orderID: order.id,
        approvalUrl: order.links.find(link => link.rel === 'approve')?.href,
        order
      });
    } else {
      // Create recurring subscription
      const subscription = await createRecurringSubscription(donationData, accessToken);

      // Store subscription attempt in database
      // await storeSubscriptionAttempt({...donationData, paypalSubscriptionId: subscription.id});

      return res.status(200).json({
        success: true,
        subscriptionID: subscription.id,
        approvalUrl: subscription.links.find(link => link.rel === 'approve')?.href,
        subscription
      });
    }
  } catch (error) {
    console.error('PayPal payment error:', error);
    return res.status(500).json({
      error: 'Payment processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}