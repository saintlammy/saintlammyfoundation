import { NextApiRequest, NextApiResponse } from 'next';
import { partnershipService, type PartnershipApplication } from '@/lib/partnershipService';
import { requireAdmin, type AdminApiRequest } from '@/lib/serverAuth';

export default async function handler(req: AdminApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (!(await requireAdmin(req, res))) return;
      return await getApplications(req, res);
    } else if (req.method === 'POST') {
      return await createApplication(req, res);
    } else if (req.method === 'PUT') {
      if (!(await requireAdmin(req, res))) return;
      return await updateApplication(req, res);
    } else if (req.method === 'DELETE') {
      if (!(await requireAdmin(req, res))) return;
      return await deleteApplication(req, res);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in partnerships/applications API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getApplications(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, priority, organization_type, partnership_type, limit, offset, id } = req.query;

    // If ID is provided, get single application
    if (id && typeof id === 'string') {
      const application = await partnershipService.getApplication(id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      return res.status(200).json({ success: true, application });
    }

    // Get all applications with filters
    const filters = {
      status: status as string,
      priority: priority as string,
      organization_type: organization_type as string,
      partnership_type: partnership_type as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    };

    const result = await partnershipService.getApplications(filters);

    return res.status(200).json({
      success: true,
      applications: result.applications,
      total: result.total
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

async function createApplication(req: NextApiRequest, res: NextApiResponse) {
  try {
    const organizationTypes: PartnershipApplication['organization_type'][] = ['corporation', 'ngo', 'government', 'foundation', 'individual', 'other'];
    const partnershipTypes: PartnershipApplication['partnership_type'][] = ['corporate-csr', 'program-collaboration', 'funding', 'resource-sharing', 'volunteer', 'other'];
    const timelines: PartnershipApplication['timeline'][] = ['immediate', 'short-term', 'medium-term', 'long-term', 'exploratory'];
    const requestedOrganizationType = String(req.body?.organization_type || 'other') as PartnershipApplication['organization_type'];
    const requestedPartnershipType = String(req.body?.partnership_type || 'other') as PartnershipApplication['partnership_type'];
    const requestedTimeline = String(req.body?.timeline || 'exploratory') as PartnershipApplication['timeline'];

    const applicationData: Omit<PartnershipApplication, 'id' | 'created_at' | 'updated_at'> = {
      organization_name: String(req.body?.organization_name || '').trim().slice(0, 255),
      contact_name: String(req.body?.contact_name || '').trim().slice(0, 255),
      email: String(req.body?.email || '').trim().toLowerCase().slice(0, 254),
      phone: String(req.body?.phone || '').trim().slice(0, 50) || undefined,
      organization_type: organizationTypes.includes(requestedOrganizationType) ? requestedOrganizationType : 'other',
      partnership_type: partnershipTypes.includes(requestedPartnershipType) ? requestedPartnershipType : 'other',
      message: String(req.body?.message || '').trim().slice(0, 5000),
      timeline: timelines.includes(requestedTimeline) ? requestedTimeline : 'exploratory',
      status: 'new',
      priority: 'medium',
      assigned_to: undefined,
      notes: undefined
    };

    // Validate required fields
    if (!applicationData.organization_name || !applicationData.contact_name || !applicationData.email || !applicationData.message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await partnershipService.createApplication(applicationData);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      success: true,
      application: result.application,
      message: 'Partnership application created successfully'
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({ error: 'Failed to create application' });
  }
}

async function updateApplication(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await partnershipService.updateApplication(id, updates);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      application: result.application,
      message: 'Partnership application updated successfully'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return res.status(500).json({ error: 'Failed to update application' });
  }
}

async function deleteApplication(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await partnershipService.deleteApplication(id);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'Partnership application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
}
