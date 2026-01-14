import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

interface RevisionData {
  content_id: string;
  title: string;
  content: string;
  excerpt?: string;
  metadata?: Record<string, any>;
  version: number;
  change_summary?: string;
  author_id?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Admin access required'
      });
    }

    const client = getTypedSupabaseClient();

    if (req.method === 'GET') {
      // GET - Fetch revisions for a content item
      const { content_id, limit = '10' } = req.query;

      if (!content_id) {
        return res.status(400).json({
          success: false,
          error: 'Content ID is required'
        });
      }

      const { data: revisions, error } = await (client
        .from('content_revisions') as any)
        .select(`
          id,
          version,
          title,
          content,
          excerpt,
          metadata,
          change_summary,
          author_id,
          created_at
        `)
        .eq('content_id', content_id)
        .order('version', { ascending: false })
        .limit(parseInt(limit as any));

      if (error) {
        console.error('Error fetching revisions:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch revisions',
          details: error.message
        });
      }

      // Transform data to include mock author info
      const transformedRevisions = (revisions as any).map((revision: any) => ({
        ...revision,
        author: {
          name: 'Admin User', // In production, fetch from users table
          email: 'admin@saintlammyfoundation.org'
        }
      }));

      return res.status(200).json({
        success: true,
        data: transformedRevisions
      });

    } else if (req.method === 'POST') {
      // POST - Create a new revision
      const { content_id, title, content, excerpt, metadata, change_summary, author_id } = req.body;

      if (!content_id || !title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Content ID, title, and content are required'
        });
      }

      // Get the current highest version number
      const { data: latestRevision } = await (client
        .from('content_revisions') as any)
        .select('version')
        .eq('content_id', content_id)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = ((latestRevision as any)?.version || 0) + 1;

      const revisionData = {
        content_id,
        title,
        content,
        excerpt: excerpt || null,
        metadata: metadata || {},
        version: nextVersion,
        change_summary: change_summary || 'Content updated',
        author_id: author_id || null,
        created_at: new Date().toISOString()
      };

      const { data: newRevision, error } = await (client
        .from('content_revisions') as any)
        .insert([revisionData] as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating revision:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create revision',
          details: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          ...(newRevision as any),
          author: {
            name: 'Admin User',
            email: 'admin@saintlammyfoundation.org'
          }
        },
        message: 'Revision created successfully'
      });

    } else if (req.method === 'PUT') {
      // PUT - Restore a specific revision
      const { content_id, revision_id } = req.body;

      if (!content_id || !revision_id) {
        return res.status(400).json({
          success: false,
          error: 'Content ID and revision ID are required'
        });
      }

      // Get the revision to restore
      const { data: revision, error: revisionError } = await (client
        .from('content_revisions') as any)
        .select('title, content, excerpt, metadata')
        .eq('id', revision_id)
        .eq('content_id', content_id)
        .single();

      if (revisionError || !revision) {
        return res.status(404).json({
          success: false,
          error: 'Revision not found'
        });
      }

      // Update the main content with the revision data
      const { data: updatedContent, error: updateError } = await (client
        .from('content_pages') as any)
        .update({
          title: (revision as any).title,
          content: (revision as any).content,
          excerpt: (revision as any).excerpt,
          metadata: (revision as any).metadata,
          updated_at: new Date().toISOString()
        }) as any)
        .eq('id', content_id)
        .select()
        .single();

      if (updateError) {
        console.error('Error restoring revision:', updateError);
        return res.status(500).json({
          success: false,
          error: 'Failed to restore revision',
          details: updateError.message
        });
      }

      // Create a new revision marking this as a restore
      const { data: latestRevision } = (await client
      .from('content_revisions') as any)
        .select('version')
        .eq('content_id', content_id)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = ((latestRevision as any)?.version || 0) + 1;

      (await client
      .from('content_revisions') as any)
        .insert([{
          content_id,
          title: (revision as any).title,
          content: (revision as any).content,
          excerpt: (revision as any).excerpt,
          metadata: (revision as any).metadata,
          version: nextVersion,
          change_summary: `Restored from revision ${revision_id}`,
          author_id: null,
          created_at: new Date().toISOString()
        }] as any);

      return res.status(200).json({
        success: true,
        data: updatedContent,
        message: 'Revision restored successfully'
      });

    } else if (req.method === 'DELETE') {
      // DELETE - Delete a specific revision (soft delete)
      const { revision_id } = req.query;

      if (!revision_id) {
        return res.status(400).json({
          success: false,
          error: 'Revision ID is required'
        });
      }

      const { error } = (await client
      .from('content_revisions') as any)
        .delete()
        .eq('id', revision_id);

      if (error) {
        console.error('Error deleting revision:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete revision',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Revision deleted successfully'
      });

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Content revisions API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}