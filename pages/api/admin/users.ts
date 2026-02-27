import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { role, status, search } = req.query;

    let query = (supabaseAdmin as any)
      .from('users')
      .select(`
        *,
        volunteers (
          id,
          status,
          interests,
          skills,
          availability,
          role_id,
          volunteer_roles (
            id,
            title,
            category
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by role
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search by name or email
    if (search && typeof search === 'string') {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        error: 'Failed to fetch users',
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, name, phone, location, role = 'user', createVolunteerRecord = false } = req.body;

    // Validation
    if (!email || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and name are required'
      });
    }

    if (!['user', 'volunteer', 'donor', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be one of: user, volunteer, donor, admin, super_admin'
      });
    }

    // Check if user already exists
    const { data: existingUser } = await (supabaseAdmin as any)
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: `A user with email ${email} already exists`
      });
    }

    // Create user
    const { data: newUser, error: userError } = await (supabaseAdmin as any)
      .from('users')
      .insert([{
        email,
        name,
        phone: phone || null,
        location: location || null,
        role,
        status: 'active',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({
        error: 'Failed to create user',
        message: userError.message
      });
    }

    // If role is volunteer or createVolunteerRecord is true, create volunteer record
    if (role === 'volunteer' || createVolunteerRecord) {
      const { error: volunteerError } = await (supabaseAdmin as any)
        .from('volunteers')
        .insert([{
          user_id: newUser.id,
          email,
          name,
          phone: phone || null,
          location: location || null,
          status: 'active', // Pre-approved since created by admin
          interests: [],
          skills: [],
          availability: [],
          created_at: new Date().toISOString()
        }]);

      if (volunteerError) {
        console.error('Error creating volunteer record:', volunteerError);
        // Don't fail the entire request, just log the error
      }

      // Grant default volunteer privileges
      const { data: privileges } = await (supabaseAdmin as any)
        .from('predefined_privileges')
        .select('key')
        .contains('default_roles', [role])
        .eq('is_active', true);

      if (privileges && privileges.length > 0) {
        const privilegeInserts = privileges.map((priv: any) => ({
          user_id: newUser.id,
          privilege_key: priv.key,
          is_active: true,
          granted_at: new Date().toISOString()
        }));

        await (supabaseAdmin as any)
          .from('user_privileges')
          .insert(privilegeInserts);
      }
    }

    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate role if provided
    if (updates.role && !['user', 'volunteer', 'donor', 'admin', 'super_admin'].includes(updates.role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be one of: user, volunteer, donor, admin, super_admin'
      });
    }

    // Validate status if provided
    if (updates.status && !['active', 'inactive', 'suspended', 'banned'].includes(updates.status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: active, inactive, suspended, banned'
      });
    }

    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Remove fields that shouldn't be updated via this endpoint
    delete updateData.userId;
    delete updateData.id;
    delete updateData.auth_user_id;
    delete updateData.created_at;

    const { data, error } = await (supabaseAdmin as any)
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        error: 'Failed to update user',
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If changing to volunteer role, create volunteer record if doesn't exist
    if (updates.role === 'volunteer') {
      const { data: existingVolunteer } = await (supabaseAdmin as any)
        .from('volunteers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!existingVolunteer) {
        await (supabaseAdmin as any)
          .from('volunteers')
          .insert([{
            user_id: userId,
            email: data.email,
            name: data.name,
            phone: data.phone,
            location: data.location,
            status: 'active',
            interests: [],
            skills: [],
            availability: [],
            created_at: new Date().toISOString()
          }]);
      }
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Soft delete by setting status to inactive
    const { data, error } = await (supabaseAdmin as any)
      .from('users')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        error: 'Failed to delete user',
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also deactivate volunteer record if exists
    await (supabaseAdmin as any)
      .from('volunteers')
      .update({ status: 'inactive' })
      .eq('user_id', userId);

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
