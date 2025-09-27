import { NextApiRequest, NextApiResponse } from 'next';
import { ContactFormSchema } from '@/lib/schemas';
import { validateInput, sanitizeHtml } from '@/lib/validation';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input using schema
    const validation = validateInput(ContactFormSchema)(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: validation.errors
      });
    }

    const contactData = validation.data;

    // Sanitize string inputs
    const sanitizedData = {
      ...contactData,
      name: sanitizeHtml(contactData.name),
      email: sanitizeHtml(contactData.email),
      subject: sanitizeHtml(contactData.subject),
      message: sanitizeHtml(contactData.message),
      phone: contactData.phone ? sanitizeHtml(contactData.phone) : undefined
    };

    // Store in Supabase database
    const client = getTypedSupabaseClient();

    // Convert to database format
    const messageData = {
      sender_name: sanitizedData.name,
      sender_email: sanitizedData.email,
      subject: sanitizedData.subject,
      content: sanitizedData.message,
      status: 'unread' as const,
      priority: 'normal' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newMessage, error } = await (client as any)
      .from('messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Error storing contact message:', error);
      return res.status(500).json({
        error: 'Failed to send message',
        message: 'Please try again later.'
      });
    }

    console.log('Contact form submission stored:', {
      id: newMessage.id,
      email: messageData.sender_email,
      timestamp: messageData.created_at
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      submissionId: newMessage.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to process contact form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}