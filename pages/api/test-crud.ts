import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, contentType, data } = req.body;

    const results = {
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
            featured_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
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
          error: error.message
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
          error: error.message
        };
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}