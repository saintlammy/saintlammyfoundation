import { NextApiRequest, NextApiResponse } from 'next';
import { partnershipService } from '@/lib/partnershipService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return await getApplications(req, res);
    } else if (req.method === 'POST') {
      return await createApplication(req, res);
    } else if (req.method === 'PUT') {
      return await updateApplication(req, res);
    } else if (req.method === 'DELETE') {
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
    const applicationData = req.body;

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
