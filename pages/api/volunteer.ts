import { NextApiRequest, NextApiResponse } from 'next';
import { VolunteerFormSchema } from '@/lib/schemas';
import { validateInput, sanitizeHtml } from '@/lib/validation';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input using schema
    const validation = validateInput(VolunteerFormSchema)(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: validation.errors
      });
    }

    const volunteerData = validation.data;

    // Sanitize string inputs
    const sanitizedData = {
      ...volunteerData,
      firstName: sanitizeHtml(volunteerData.firstName),
      lastName: sanitizeHtml(volunteerData.lastName),
      email: sanitizeHtml(volunteerData.email),
      phone: volunteerData.phone ? sanitizeHtml(volunteerData.phone) : undefined,
      location: sanitizeHtml(volunteerData.location),
      availability: sanitizeHtml(volunteerData.availability),
      experience: sanitizeHtml(volunteerData.experience),
      motivation: sanitizeHtml(volunteerData.motivation),
      skills: sanitizeHtml(volunteerData.skills),
      commitment: sanitizeHtml(volunteerData.commitment),
      interests: volunteerData.interests.map(interest => sanitizeHtml(interest))
    };

    // Store in Supabase database
    const client = getTypedSupabaseClient();

    // Convert to database format
    const dbData = {
      first_name: sanitizedData.firstName,
      last_name: sanitizedData.lastName,
      email: sanitizedData.email.toLowerCase().trim(),
      phone: sanitizedData.phone || '',
      location: sanitizedData.location,
      interests: sanitizedData.interests,
      availability: sanitizedData.availability,
      experience: sanitizedData.experience,
      motivation: sanitizedData.motivation,
      skills: sanitizedData.skills,
      background_check: sanitizedData.backgroundCheck,
      commitment: sanitizedData.commitment,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Check if email already exists
    const { data: existingVolunteer } = await (client as any)
      .from('volunteers')
      .select('email')
      .eq('email', dbData.email)
      .single();

    if (existingVolunteer) {
      return res.status(409).json({
        error: 'Application already exists',
        message: 'A volunteer application with this email already exists.'
      });
    }

    const { data: newVolunteer, error } = await (client as any)
      .from('volunteers')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error storing volunteer application:', error);
      return res.status(500).json({
        error: 'Failed to submit application',
        message: 'Please try again later.'
      });
    }

    console.log('Volunteer application submitted:', {
      id: newVolunteer.id,
      email: dbData.email,
      timestamp: dbData.created_at
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your volunteer application! We will review it and get back to you within 5-7 business days.',
      applicationId: newVolunteer.id,
      timestamp: new Date().toISOString(),
      nextSteps: [
        'Application review by our volunteer coordinator',
        'Background check verification (if applicable)',
        'Interview scheduling',
        'Volunteer orientation and training'
      ]
    });

  } catch (error) {
    console.error('Volunteer application error:', error);
    return res.status(500).json({
      error: 'Failed to process volunteer application',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}