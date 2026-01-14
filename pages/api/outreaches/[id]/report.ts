import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

// In-memory storage for mock reports (fallback when no database)
// Pre-populated with default report data
const mockReports: Record<string, any> = {
  '4': {
    id: '4',
    title: 'Independence Day Medical Outreach 2024',
    date: '2024-10-01',
    location: 'Ikeja, Lagos State',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Our flagship medical outreach program providing free healthcare services, medical check-ups, medications, and health education to underserved communities in Ikeja, Lagos.',
    targetBeneficiaries: 400,
    actualBeneficiaries: 487,
    beneficiaryCategories: [
      { category: 'Children (0-12)', count: 145 },
      { category: 'Teenagers (13-17)', count: 68 },
      { category: 'Adults (18-60)', count: 189 },
      { category: 'Elderly (60+)', count: 85 }
    ],
    impact: [
      { title: 'Medical Consultations', value: 487, description: 'Free consultations provided' },
      { title: 'Medications Distributed', value: 234, description: 'Essential medications given' },
      { title: 'Health Screenings', value: 312, description: 'Blood pressure, diabetes, malaria tests' },
      { title: 'Specialist Referrals', value: 56, description: 'Referred to partner hospitals' },
      { title: 'Eyeglasses Provided', value: 42, description: 'Free prescription glasses' },
      { title: 'Dental Check-ups', value: 89, description: 'Free dental examinations' }
    ],
    budget: {
      planned: 2500000,
      actual: 2340000,
      breakdown: [
        { category: 'Medical Supplies', amount: 980000, percentage: 42 },
        { category: 'Medications', amount: 750000, percentage: 32 },
        { category: 'Personnel/Volunteers', amount: 350000, percentage: 15 },
        { category: 'Logistics & Transport', amount: 160000, percentage: 7 },
        { category: 'Marketing & Outreach', amount: 100000, percentage: 4 }
      ]
    },
    volunteers: {
      registered: 45,
      participated: 38,
      hours: 304
    },
    activities: [
      { title: 'Registration & Triage', description: 'Patient registration and initial screening', completed: true },
      { title: 'General Medical Consultation', description: 'Consultations with general practitioners', completed: true },
      { title: 'Blood Pressure & Diabetes Screening', description: 'Free health screenings for all attendees', completed: true },
      { title: 'Malaria Testing', description: 'Rapid diagnostic tests for malaria', completed: true },
      { title: 'Medication Distribution', description: 'Free essential medications dispensing', completed: true },
      { title: 'Dental Check-ups', description: 'Basic dental examinations', completed: true },
      { title: 'Eye Care Services', description: 'Vision tests and eyeglasses distribution', completed: true },
      { title: 'Health Education Sessions', description: 'Community health awareness talks', completed: true },
      { title: 'Nutritional Counseling', description: 'Dietary advice and nutrition support', completed: true },
      { title: 'Follow-up Referrals', description: 'Specialist hospital referrals for critical cases', completed: true }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
      'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800'
    ],
    testimonials: [
      {
        name: 'Mrs. Folake Adeyemi',
        role: 'Beneficiary',
        message: 'I received free medication for my diabetes and blood pressure. The doctors were very professional and caring. God bless Saintlammy Foundation!',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?w=400'
      },
      {
        name: 'Mr. Chukwudi Okonkwo',
        role: 'Volunteer Doctor',
        message: 'It was a privilege to serve alongside such dedicated volunteers. The organization and impact were truly remarkable.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
      },
      {
        name: 'Miss Aisha Mohammed',
        role: 'Community Leader',
        message: 'This outreach brought hope to our community. Many people who cannot afford healthcare received much-needed medical attention.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
      }
    ],
    futurePlans: [
      'Expand medical outreach to 3 more communities in Q1 2025',
      'Partner with additional hospitals for specialist referrals',
      'Establish mobile clinic for hard-to-reach rural areas',
      'Launch follow-up program to track patient outcomes',
      'Create health education video series in local languages'
    ],
    partners: [
      { name: 'Lagos State Ministry of Health', contribution: 'Medical personnel and supplies support' },
      { name: 'Reddington Hospital', contribution: 'Specialist referral partnership' },
      { name: 'PharmAccess Foundation', contribution: 'Medication donations' }
    ],
    reportDocument: '/reports/independence-day-medical-outreach-2024.pdf',
    socialMedia: [
      { platform: 'Facebook', reach: 12500, engagement: 1850 },
      { platform: 'Instagram', reach: 8300, engagement: 2100 },
      { platform: 'Twitter', reach: 5600, engagement: 980 }
    ]
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid outreach ID' });
  }

  const client = getTypedSupabaseClient();

  try {
    switch (method) {
      case 'GET':
        return await getOutreachReport(client, id, res);
      case 'POST':
      case 'PUT':
        return await saveOutreachReport(client, id, req, res);
      case 'DELETE':
        return await deleteOutreachReport(client, id, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Outreach report API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getOutreachReport(client: any, id: string, res: NextApiResponse) {
  try {
    // Check mock storage first
    if (mockReports[id]) {
      return res.status(200).json(mockReports[id]);
    }

    // Try to get from database if available
    if (client) {
      const { data, error } = await (client
        .from('outreach_reports') as any)
        .select('*')
        .eq('outreach_id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
      }

      if (data) {
        // Parse JSON fields
        const parsedData = {
          id: data.outreach_id,
          title: data.title,
          date: data.date,
          location: data.location,
          status: data.status,
          image: data.image,
          description: data.description,
          targetBeneficiaries: data.target_beneficiaries,
          actualBeneficiaries: data.actual_beneficiaries,
          beneficiaryCategories: typeof data.beneficiary_categories === 'string'
            ? JSON.parse(data.beneficiary_categories)
            : data.beneficiary_categories || [],
          impact: typeof data.impact === 'string' ? JSON.parse(data.impact) : data.impact || [],
          budget: typeof data.budget === 'string' ? JSON.parse(data.budget) : data.budget || {},
          volunteers: typeof data.volunteers === 'string' ? JSON.parse(data.volunteers) : data.volunteers || {},
          activities: typeof data.activities === 'string' ? JSON.parse(data.activities) : data.activities || [],
          gallery: typeof data.gallery === 'string' ? JSON.parse(data.gallery) : data.gallery || [],
          testimonials: typeof data.testimonials === 'string' ? JSON.parse(data.testimonials) : data.testimonials || [],
          futurePlans: typeof data.future_plans === 'string' ? JSON.parse(data.future_plans) : data.future_plans || [],
          partners: typeof data.partners === 'string' ? JSON.parse(data.partners) : data.partners || [],
          reportDocument: data.report_document,
          socialMedia: typeof data.social_media === 'string' ? JSON.parse(data.social_media) : data.social_media || [],
        };

        return res.status(200).json(parsedData);
      }
    }

    return res.status(404).json({ error: 'Outreach report not found' });
  } catch (error) {
    console.error('Error fetching outreach report:', error);
    return res.status(500).json({ error: 'Failed to fetch outreach report' });
  }
}

async function saveOutreachReport(client: any, id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportData = req.body;

    // Always save to mock storage (for session persistence)
    mockReports[id] = {
      ...reportData,
      id: id,
      updated_at: new Date().toISOString()
    };

    // Try database save if available
    if (client) {
      try {
        const dbData = {
          outreach_id: id,
          title: reportData.title,
          date: reportData.date,
          location: reportData.location,
          status: reportData.status,
          image: reportData.image,
          description: reportData.description,
          target_beneficiaries: reportData.targetBeneficiaries,
          actual_beneficiaries: reportData.actualBeneficiaries,
          beneficiary_categories: JSON.stringify(reportData.beneficiaryCategories || []),
          impact: JSON.stringify(reportData.impact || []),
          budget: JSON.stringify(reportData.budget || {}),
          volunteers: JSON.stringify(reportData.volunteers || {}),
          activities: JSON.stringify(reportData.activities || []),
          gallery: JSON.stringify(reportData.gallery || []),
          testimonials: JSON.stringify(reportData.testimonials || []),
          future_plans: JSON.stringify(reportData.futurePlans || []),
          partners: JSON.stringify(reportData.partners || []),
          report_document: reportData.reportDocument,
          social_media: JSON.stringify(reportData.socialMedia || []),
          updated_at: new Date().toISOString()
        };

        const { data: existing } = await (client
          .from('outreach_reports') as any)
          .select('id')
          .eq('outreach_id', id)
          .single();

        if (existing) {
          await (client
            .from('outreach_reports') as any)
            .update(dbData)
            .eq('outreach_id', id);
        } else {
          await (client
            .from('outreach_reports') as any)
            .insert([{
              ...dbData,
              created_at: new Date().toISOString()
            }] as any);
        }
      } catch (dbError) {
        console.log('Database save skipped (using mock storage):', dbError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Outreach report saved successfully',
      data: mockReports[id]
    });
  } catch (error) {
    console.error('Error saving outreach report:', error);
    return res.status(500).json({
      error: 'Failed to save outreach report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function deleteOutreachReport(client: any, id: string, res: NextApiResponse) {
  try {
    // Delete from mock storage
    delete mockReports[id];

    // Try to delete from database if available
    if (client) {
      try {
        await (client
          .from('outreach_reports') as any)
          .delete()
          .eq('outreach_id', id);
      } catch (dbError) {
        console.log('Database delete skipped (using mock storage):', dbError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Outreach report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting outreach report:', error);
    return res.status(500).json({ error: 'Failed to delete outreach report' });
  }
}
