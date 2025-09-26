import { NextApiRequest, NextApiResponse } from 'next';
import { VolunteerFormSchema } from '@/lib/schemas';
import { validateInput, sanitizeHtml } from '@/lib/validation';

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

    // TODO: Implement volunteer management system
    console.log('Volunteer application submission:', sanitizedData);

    // In a real implementation, you would:
    // 1. Store the volunteer application in the database
    // 2. Send email notification to admin for review
    // 3. Send confirmation email to applicant
    // 4. Trigger background check process if required
    // 5. Create volunteer profile in management system

    // For now, simulate processing
    const applicationId = `vol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return res.status(200).json({
      success: true,
      message: 'Thank you for your volunteer application! We will review it and get back to you within 5-7 business days.',
      applicationId,
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