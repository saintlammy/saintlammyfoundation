import { NextApiRequest, NextApiResponse } from 'next';
import { NewsletterFormSchema } from '@/lib/schemas';
import { validateInput, sanitizeHtml } from '@/lib/validation';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input using schema
    const validation = validateInput(NewsletterFormSchema)(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: validation.errors
      });
    }

    const newsletterData = validation.data;

    // Sanitize input
    const sanitizedData = {
      name: sanitizeHtml(newsletterData.name),
      email: newsletterData.email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      isActive: true,
      source: 'website'
    };

    // Store in Supabase
    const client = getTypedSupabaseClient();

    // Check if email already exists
    const { data: existingSubscriber } = await (client as any)
      .from('newsletter_subscribers')
      .select('email, is_active')
      .eq('email', sanitizedData.email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(409).json({
          error: 'Email already subscribed',
          message: 'This email is already subscribed to our newsletter.'
        });
      } else {
        // Reactivate existing subscription
        const { error: updateError } = await (client as any)
          .from('newsletter_subscribers')
          .update({
            name: sanitizedData.name,
            is_active: true,
            subscribedAt: sanitizedData.subscribedAt
          })
          .eq('email', sanitizedData.email);

        if (updateError) {
          console.error('Error reactivating newsletter subscription:', updateError);
          return res.status(500).json({
            error: 'Failed to reactivate subscription',
            message: 'Please try again later.'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Newsletter subscription reactivated successfully!',
          data: { email: sanitizedData.email }
        });
      }
    }

    // Create new subscription
    const { data: newSubscriber, error: insertError } = await (client as any)
      .from('newsletter_subscribers')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Error storing newsletter subscription:', insertError);
      return res.status(500).json({
        error: 'Failed to subscribe to newsletter',
        message: 'Please try again later.'
      });
    }

    // Log successful subscription for analytics
    console.log('New newsletter subscription:', {
      email: sanitizedData.email,
      source: 'website',
      timestamp: sanitizedData.subscribedAt
    });

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to Hope Dispatch newsletter!',
      data: {
        email: sanitizedData.email,
        subscribedAt: sanitizedData.subscribedAt
      }
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process newsletter subscription. Please try again later.'
    });
  }
}