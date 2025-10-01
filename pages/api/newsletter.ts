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

    // Store in Supabase with timeout
    const client = getTypedSupabaseClient();

    // Add timeout wrapper for database operations
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timeout')), 5000)
    );

    // Check if email already exists with timeout
    const { data: existingSubscriber } = await Promise.race([
      (client as any)
        .from('newsletter_subscribers')
        .select('email, is_active')
        .eq('email', sanitizedData.email)
        .single(),
      timeoutPromise
    ]).catch((error) => {
      console.warn('Database query failed or timed out:', error.message);
      return { data: null, error };
    }) as any;

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(409).json({
          error: 'Email already subscribed',
          message: 'This email is already subscribed to our newsletter.'
        });
      } else {
        // Reactivate existing subscription with timeout
        const { error: updateError } = await Promise.race([
          (client as any)
            .from('newsletter_subscribers')
            .update({
              name: sanitizedData.name,
              is_active: true,
              subscribedAt: sanitizedData.subscribedAt
            })
            .eq('email', sanitizedData.email),
          timeoutPromise
        ]).catch((error) => ({ error })) as any;

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

    // Create new subscription with timeout
    const { data: newSubscriber, error: insertError } = await Promise.race([
      (client as any)
        .from('newsletter_subscribers')
        .insert([sanitizedData])
        .select()
        .single(),
      timeoutPromise
    ]).catch((error) => {
      console.warn('Database insert failed or timed out:', error.message);
      return { data: null, error };
    }) as any;

    if (insertError) {
      console.error('Error storing newsletter subscription:', insertError);

      // If database unavailable, log for manual processing
      if (insertError.message?.includes('timeout') || insertError.message?.includes('table')) {
        console.log('NEWSLETTER SIGNUP (DB unavailable):', sanitizedData);
        return res.status(200).json({
          success: true,
          message: 'Thank you for subscribing! We will add you to our newsletter shortly.',
          data: { email: sanitizedData.email }
        });
      }

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