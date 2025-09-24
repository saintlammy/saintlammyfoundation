import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { donationService } from '@/lib/donationService';

const PAYPAL_API_BASE = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

interface PayPalVerificationRequest {
  paymentId?: string;
  subscriptionId?: string;
  payerId?: string;
  token?: string;
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

async function capturePayPalOrder(orderId: string, accessToken: string) {
  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw new Error('Failed to capture PayPal payment');
  }
}

async function getPayPalOrderDetails(orderId: string, accessToken: string) {
  try {
    const response = await axios.get(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayPal order details error:', error);
    throw new Error('Failed to get PayPal order details');
  }
}

async function getPayPalSubscriptionDetails(subscriptionId: string, accessToken: string) {
  try {
    const response = await axios.get(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayPal subscription details error:', error);
    throw new Error('Failed to get PayPal subscription details');
  }
}

async function storeDonationRecord(donationData: any) {
  try {
    console.log('Storing PayPal donation record:', donationData);

    const result = await donationService.storePayPalDonation(donationData);

    console.log('Successfully stored PayPal donation:', result.donationId);
    return result;
  } catch (error) {
    console.error('Error storing PayPal donation:', error);
    // Fallback to temporary record if database fails
    return {
      donationId: `donation_${Date.now()}`,
      receiptNumber: `RCP-${Date.now()}`,
      status: 'completed'
    };
  }
}

async function sendDonationConfirmationEmail(donationData: any) {
  // TODO: Implement email service
  console.log('Sending confirmation email:', donationData);

  // In a real implementation, you would:
  // 1. Use email service (SendGrid, Mailgun, etc.)
  // 2. Send donor confirmation
  // 3. Send admin notification
  // 4. Include tax receipt

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, subscriptionId, payerId, token }: PayPalVerificationRequest = req.body;

    if (!paymentId && !subscriptionId) {
      return res.status(400).json({
        error: 'Missing required fields: paymentId or subscriptionId'
      });
    }

    const accessToken = await getPayPalAccessToken();

    if (paymentId) {
      // Handle one-time payment
      const orderDetails = await getPayPalOrderDetails(paymentId, accessToken);

      if (orderDetails.status === 'APPROVED') {
        // Capture the payment
        const captureResult = await capturePayPalOrder(paymentId, accessToken);

        if (captureResult.status === 'COMPLETED') {
          // Extract donation information
          const purchaseUnit = captureResult.purchase_units[0];
          const capture = purchaseUnit.payments.captures[0];
          const customData = JSON.parse(purchaseUnit.custom_id || '{}');

          const donationData = {
            type: 'one-time' as const,
            paymentId: captureResult.id,
            paypalOrderId: paymentId,
            amount: parseFloat(capture.amount.value),
            currency: capture.amount.currency_code,
            payerId: captureResult.payer?.payer_id,
            payerEmail: captureResult.payer?.email_address,
            payerName: `${captureResult.payer?.name?.given_name || ''} ${captureResult.payer?.name?.surname || ''}`.trim(),
            donorName: customData.donorName,
            donorEmail: customData.donorEmail,
            message: customData.message,
            source: customData.source,
            category: customData.category as 'orphan' | 'widow' | 'home' | 'general' | undefined,
            timestamp: captureResult.create_time,
            fees: capture.seller_receivable_breakdown?.paypal_fee?.value || '0'
          };

          // Store in database
          const record = await storeDonationRecord(donationData);

          // Send confirmation email
          await sendDonationConfirmationEmail({
            ...donationData,
            donationId: record.donationId,
            receiptNumber: record.receiptNumber
          });

          return res.status(200).json({
            success: true,
            donation: {
              id: record.donationId,
              amount: donationData.amount,
              currency: donationData.currency,
              type: donationData.type,
              status: donationData.status,
              receiptNumber: record.receiptNumber,
              paymentDate: donationData.timestamp
            }
          });
        } else {
          throw new Error(`Payment capture failed: ${captureResult.status}`);
        }
      } else {
        throw new Error(`Order not approved: ${orderDetails.status}`);
      }
    } else if (subscriptionId) {
      // Handle subscription
      const subscriptionDetails = await getPayPalSubscriptionDetails(subscriptionId, accessToken);

      if (subscriptionDetails.status === 'ACTIVE') {
        // Extract subscription information
        const donationData = {
          type: 'subscription' as const,
          subscriptionId: subscriptionDetails.id,
          amount: parseFloat(subscriptionDetails.billing_info?.last_payment?.amount?.value || '0'),
          currency: subscriptionDetails.billing_info?.last_payment?.amount?.currency_code || 'USD',
          frequency: subscriptionDetails.plan?.billing_cycles?.[0]?.frequency?.interval_unit?.toLowerCase() as 'monthly' | 'weekly' | 'yearly' | undefined,
          payerId: subscriptionDetails.subscriber?.payer_id,
          payerEmail: subscriptionDetails.subscriber?.email_address,
          payerName: `${subscriptionDetails.subscriber?.name?.given_name || ''} ${subscriptionDetails.subscriber?.name?.surname || ''}`.trim(),
          startDate: subscriptionDetails.start_time,
          nextBillingDate: subscriptionDetails.billing_info?.next_billing_time
        };

        // Store in database
        const record = await storeDonationRecord(donationData);

        // Send confirmation email
        await sendDonationConfirmationEmail({
          ...donationData,
          donationId: record.donationId,
          receiptNumber: record.receiptNumber
        });

        return res.status(200).json({
          success: true,
          subscription: {
            id: record.donationId,
            subscriptionId: donationData.subscriptionId,
            amount: donationData.amount,
            currency: donationData.currency,
            frequency: donationData.frequency,
            status: donationData.status,
            nextBillingDate: donationData.nextBillingDate,
            receiptNumber: record.receiptNumber
          }
        });
      } else {
        throw new Error(`Subscription not active: ${subscriptionDetails.status}`);
      }
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: 'Payment verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Webhook handler for PayPal events (separate endpoint)
export async function handlePayPalWebhook(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Implement PayPal webhook verification and handling
  // This would handle events like:
  // - PAYMENT.CAPTURE.COMPLETED
  // - BILLING.SUBSCRIPTION.ACTIVATED
  // - BILLING.SUBSCRIPTION.CANCELLED
  // - BILLING.SUBSCRIPTION.PAYMENT.FAILED

  console.log('PayPal webhook received:', req.body);

  return res.status(200).json({ success: true });
}