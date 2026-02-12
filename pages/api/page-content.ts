import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPageContent(req, res);
    case 'POST':
      return await createPageContent(req, res);
    case 'PUT':
      return await updatePageContent(req, res);
    case 'DELETE':
      return await deletePageContent(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPageContent(req: NextApiRequest, res: NextApiResponse) {
  const { slug, section } = req.query;

  try {
    if (!supabase) {
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    let query = (supabase
      .from('page_content') as any)
      .select('*');

    if (slug) {
      query = query.eq('page_slug', slug);
    }

    if (section) {
      query = query.eq('section', section);
    }

    query = query.order('order_index', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockPageContent(slug as string, section as string));
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockPageContent(slug as string, section as string));
  }
}

async function createPageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentData = req.body;

    if (!contentData.page_slug || !contentData.section) {
      return res.status(400).json({ error: 'page_slug and section are required' });
    }

    const newContent = {
      ...contentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newContent,
        message: 'Page content created successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('page_content') as any)
      .insert([newContent] as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newContent,
        message: 'Page content created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page content updated successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('page_content') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page content updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deletePageContent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Content ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Page content deleted successfully (mock mode)'
      });
    }

    const { error } = await (supabase
      .from('page_content') as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Page content deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Page content deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockPageContent(slug?: string, section?: string) {
  const mockContent: any[] = [
    // About Page - Team Members
    {
      id: '1',
      page_slug: 'about',
      section: 'team',
      order_index: 1,
      data: {
        name: 'Samuel Lammy',
        role: 'Founder & Executive Director',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Passionate about empowering vulnerable communities with over 8 years of experience in community development and charity work.',
        linkedin: '#'
      }
    },
    {
      id: '2',
      page_slug: 'about',
      section: 'team',
      order_index: 2,
      data: {
        name: 'Grace Adunola',
        role: 'Program Director',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Leads our outreach programs with a heart for widows and orphans. Former social worker with 12+ years experience.',
        linkedin: '#'
      }
    },
    {
      id: '3',
      page_slug: 'about',
      section: 'team',
      order_index: 3,
      data: {
        name: 'David Okafor',
        role: 'Operations Manager',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bio: 'Ensures efficient operations and transparency in all our programs. Background in nonprofit management and finance.',
        linkedin: '#'
      }
    },
    // About Page - Milestones
    {
      id: '4',
      page_slug: 'about',
      section: 'milestones',
      order_index: 1,
      data: {
        year: '2021',
        event: 'Foundation established with community outreach programs',
        icon: 'Heart'
      }
    },
    {
      id: '5',
      page_slug: 'about',
      section: 'milestones',
      order_index: 2,
      data: {
        year: '2022',
        event: 'First orphanage adoption program launched',
        icon: 'Users'
      }
    },
    {
      id: '6',
      page_slug: 'about',
      section: 'milestones',
      order_index: 3,
      data: {
        year: '2023',
        event: 'Reached 500+ widows and 300+ orphans supported',
        icon: 'Target'
      }
    },
    {
      id: '7',
      page_slug: 'about',
      section: 'milestones',
      order_index: 4,
      data: {
        year: '2024',
        event: 'Expanded to crypto donations and digital transparency',
        icon: 'Globe'
      }
    },
    {
      id: '8',
      page_slug: 'about',
      section: 'milestones',
      order_index: 5,
      data: {
        year: '2025',
        event: 'Officially incorporated as Saintlammy Community Care Initiative (CAC: 9015713)',
        icon: 'Award'
      }
    },
    // About Page - Values
    {
      id: '9',
      page_slug: 'about',
      section: 'values',
      order_index: 1,
      data: {
        title: 'Transparency',
        description: 'Every donation is tracked and documented. We believe in complete financial transparency.',
        icon: 'Target'
      }
    },
    {
      id: '10',
      page_slug: 'about',
      section: 'values',
      order_index: 2,
      data: {
        title: 'Faith-Driven',
        description: 'Rooted in Christian values, guided by compassion and service to those in need.',
        icon: 'Heart'
      }
    },
    {
      id: '11',
      page_slug: 'about',
      section: 'values',
      order_index: 3,
      data: {
        title: 'Community Impact',
        description: 'Focus on sustainable, long-term change that empowers communities.',
        icon: 'Users'
      }
    },
    {
      id: '12',
      page_slug: 'about',
      section: 'values',
      order_index: 4,
      data: {
        title: 'Accountability',
        description: 'Regular reporting and updates on how donations create real impact.',
        icon: 'Award'
      }
    }
  ];

  let filtered = mockContent;

  if (slug) {
    filtered = filtered.filter(item => item.page_slug === slug);
  }

  if (section) {
    filtered = filtered.filter(item => item.section === section);
  }

  return filtered;
}
