import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      // Return mock data if database not configured
      return res.status(200).json(getMockOutreachReport(id as string));
    }

    // Fetch outreach from database
    const { data: outreach, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id as any)
      .eq('type', 'outreach')
      .single();

    if (error || !outreach) {
      console.error('Error fetching outreach:', error);
      return res.status(200).json(getMockOutreachReport(id as string));
    }

    // Transform database data to report format
    const report = transformToReport(outreach);
    return res.status(200).json(report);

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to fetch outreach report' });
  }
}

function transformToReport(outreach: any) {
  // Transform database content to full report format
  const metadata = outreach.metadata || {};

  return {
    id: outreach.id,
    title: outreach.title,
    date: new Date(outreach.publish_date || outreach.created_at).toLocaleDateString(),
    location: metadata.location || 'Not specified',
    status: outreach.status === 'published' ? 'completed' : 'upcoming',
    image: outreach.featured_image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    description: outreach.excerpt || outreach.content,

    targetBeneficiaries: metadata.targetBeneficiaries || 0,
    actualBeneficiaries: metadata.actualBeneficiaries || 0,
    beneficiaryCategories: metadata.beneficiaryCategories || [],

    impact: metadata.impact || [],
    budget: metadata.budget || {
      planned: 0,
      actual: 0,
      breakdown: []
    },
    volunteers: metadata.volunteers || {
      registered: 0,
      participated: 0,
      hours: 0
    },
    activities: metadata.activities || [],
    gallery: metadata.gallery || [],
    testimonials: metadata.testimonials || [],
    futurePlans: metadata.futurePlans || [],
    partners: metadata.partners || [],
    reportDocument: metadata.reportDocument,
    socialMedia: metadata.socialMedia || []
  };
}

function getMockOutreachReport(id: string) {
  // Mock data for demonstration
  return {
    id: id,
    title: 'Independence Day Medical Outreach 2024',
    date: 'October 1, 2024',
    location: 'Ikeja, Lagos State',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
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
      { title: 'Blood Pressure & Diabetes Screening', description: 'Free health screenings', completed: true },
      { title: 'Malaria Testing', description: 'Rapid diagnostic tests', completed: true },
      { title: 'Medication Distribution', description: 'Free medications', completed: true },
      { title: 'Dental Check-ups', description: 'Basic dental examinations', completed: true },
      { title: 'Eye Care Services', description: 'Vision tests and eyeglasses', completed: true },
      { title: 'Health Education Sessions', description: 'Community health awareness', completed: true }
    ],

    gallery: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800'
    ],

    testimonials: [
      {
        name: 'Mrs. Folake Adeyemi',
        role: 'Beneficiary',
        message: 'I received free medication for my diabetes. The doctors were very professional. God bless Saintlammy Foundation!',
        image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?w=400'
      }
    ],

    futurePlans: [
      'Expand medical outreach to 3 more communities in Q1 2025',
      'Partner with additional hospitals for specialist referrals',
      'Establish mobile clinic for hard-to-reach rural areas'
    ],

    partners: [
      {
        name: 'Lagos State Ministry of Health',
        contribution: 'Medical personnel and supplies support'
      }
    ],

    reportDocument: '/reports/independence-day-medical-outreach-2024.pdf',

    socialMedia: [
      { platform: 'Facebook', reach: 12500, engagement: 1850 },
      { platform: 'Instagram', reach: 8300, engagement: 2100 }
    ]
  };
}
