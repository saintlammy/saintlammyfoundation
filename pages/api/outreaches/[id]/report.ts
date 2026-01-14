import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

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
    // Try to get from database first
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

    return res.status(404).json({ error: 'Outreach report not found' });
  } catch (error) {
    console.error('Error fetching outreach report:', error);
    return res.status(500).json({ error: 'Failed to fetch outreach report' });
  }
}

async function saveOutreachReport(client: any, id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportData = req.body;

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

    let result;

    if (existing) {
      result = await (client
        .from('outreach_reports') as any)
        .update(dbData)
        .eq('outreach_id', id)
        .select()
        .single();
    } else {
      result = await (client
        .from('outreach_reports') as any)
        .insert([{
          ...dbData,
          created_at: new Date().toISOString()
        }] as any)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database save error:', result.error);
      return res.status(500).json({ error: 'Failed to save outreach report' });
    }

    return res.status(200).json({
      success: true,
      message: existing ? 'Outreach report updated successfully' : 'Outreach report created successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error saving outreach report:', error);
    return res.status(500).json({ error: 'Failed to save outreach report' });
  }
}

async function deleteOutreachReport(client: any, id: string, res: NextApiResponse) {
  try {
    const { error } = await (client
      .from('outreach_reports') as any)
      .delete()
      .eq('outreach_id', id);

    if (error) {
      console.error('Database delete error:', error);
      return res.status(500).json({ error: 'Failed to delete outreach report' });
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
