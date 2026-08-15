import { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/serverAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, contentType, data } = req.body;

    const results: {
      action: string;
      contentType: string;
      timestamp: string;
      results: Record<string, any>;
    } = {
      action,
      contentType,
      timestamp: new Date().toISOString(),
      results: {}
    };

    // Test CREATE operation
    if (action === 'create' || action === 'all') {
      try {
        const createResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/${contentType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data || {
            title: `Test ${contentType} Item`,
            content: `This is a test ${contentType} item created by the CRUD test.`,
            status: 'draft',
            excerpt: `Test excerpt for ${contentType}`,
            featured_image: '/images/nigerian-ngo/orphan-care.webp'
          }),
        });

        const createResult = await createResponse.json();
        results.results.create = {
          success: createResponse.ok,
          status: createResponse.status,
          data: createResult
        };
      } catch (error) {
        results.results.create = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // Test READ operation
    if (action === 'read' || action === 'all') {
      try {
        const readResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/${contentType}`);
        const readResult = await readResponse.json();
        results.results.read = {
          success: readResponse.ok,
          status: readResponse.status,
          count: Array.isArray(readResult) ? readResult.length : 'N/A',
          data: readResult
        };
      } catch (error) {
        results.results.read = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdminAuth(handler);
