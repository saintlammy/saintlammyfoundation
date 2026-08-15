import { NextApiRequest, NextApiResponse } from 'next';
import { partnershipService } from '@/lib/partnershipService';
import { requireAdmin, type AdminApiRequest } from '@/lib/serverAuth';

export default async function handler(req: AdminApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      return await getTeamMembers(req, res);
    } else if (req.method === 'POST') {
      if (!(await requireAdmin(req, res))) return;
      return await createTeamMember(req, res);
    } else if (req.method === 'PUT') {
      if (!(await requireAdmin(req, res))) return;
      return await updateTeamMember(req, res);
    } else if (req.method === 'DELETE') {
      if (!(await requireAdmin(req, res))) return;
      return await deleteTeamMember(req, res);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in partnerships/team API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getTeamMembers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status } = req.query;

    const result = await partnershipService.getTeamMembers(status as string);

    return res.status(200).json({
      success: true,
      members: result.members,
      total: result.total
    });
  } catch (error) {
    console.error('Error getting team members:', error);
    return res.status(500).json({ error: 'Failed to fetch team members' });
  }
}

async function createTeamMember(req: NextApiRequest, res: NextApiResponse) {
  try {
    const memberData = req.body;

    // Validate required fields
    if (!memberData.name || !memberData.role || !memberData.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await partnershipService.createTeamMember(memberData);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      success: true,
      member: result.member,
      message: 'Team member created successfully'
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return res.status(500).json({ error: 'Failed to create team member' });
  }
}

async function updateTeamMember(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Team member ID is required' });
    }

    const result = await partnershipService.updateTeamMember(id, updates);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      member: result.member,
      message: 'Team member updated successfully'
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return res.status(500).json({ error: 'Failed to update team member' });
  }
}

async function deleteTeamMember(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Team member ID is required' });
    }

    const result = await partnershipService.deleteTeamMember(id);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return res.status(500).json({ error: 'Failed to delete team member' });
  }
}
