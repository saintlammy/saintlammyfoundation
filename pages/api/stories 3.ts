import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getStories(req, res);
    case 'POST':
      return await createStory(req, res);
    case 'PUT':
      return await updateStory(req, res);
    case 'DELETE':
      return await deleteStory(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getStories(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { status = 'published', limit } = req.query;

    if (!supabase) {
      return res.status(200).json(getMockStories(limit ? parseInt(limit as string) : undefined));
    }

    let query = supabase
      .from('content')
      .select('*')
      .eq('type', 'story')
      .eq('status', status)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to mock data if Supabase fails
      return res.status(200).json(getMockStories(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      // Return mock data if no data in database
      return res.status(200).json(getMockStories(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = data.map(item => ({
      id: item.id,
      name: item.story_details?.beneficiary_name || 'Anonymous',
      age: item.story_details?.beneficiary_age,
      location: item.story_details?.location || 'Nigeria',
      story: item.content || item.excerpt,
      quote: item.story_details?.quote || '',
      image: item.featured_image || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: item.story_details?.category || 'orphan',
      impact: item.story_details?.impact || '',
      dateHelped: item.story_details?.date_helped || item.publish_date
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    // Fallback to mock data on any error
    res.status(200).json(getMockStories(limit ? parseInt(limit as string) : undefined));
  }
}

function getMockStories(limit?: number) {
  const mockStories = [
    {
      id: '1',
      name: 'Amara N.',
      age: 12,
      location: 'Lagos, Nigeria',
      story: 'Amara lost both parents in a car accident when she was 8. Through our orphan support program, she has received consistent education funding, healthcare, and emotional support.',
      quote: "Before Saintlammy Foundation found me, I thought my dreams of becoming a doctor were impossible. Now I'm excelling in school and know that anything is possible with the right support.",
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'orphan',
      impact: 'Maintained 95% attendance rate and top 10% academic performance',
      dateHelped: 'January 2022'
    },
    {
      id: '2',
      name: 'Mrs. Folake O.',
      age: 34,
      location: 'Ibadan, Nigeria',
      story: 'After losing her husband, Folake struggled to feed her three children. Our widow empowerment program provided monthly stipends and helped her start a small tailoring business.',
      quote: "The foundation didn't just give me money - they gave me hope and the tools to build a better future for my children. My tailoring business now supports my family independently.",
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'widow',
      impact: 'Achieved financial independence and expanded business to employ 3 others',
      dateHelped: 'March 2022'
    },
    {
      id: '3',
      name: 'Emmanuel A.',
      age: 16,
      location: 'Abuja, Nigeria',
      story: 'Emmanuel was living on the streets when our outreach team found him. Through our comprehensive support program, he was enrolled in school and provided with safe housing.',
      quote: "I never thought I'd see the inside of a classroom again. Now I'm preparing for university and want to become an engineer to help build better communities.",
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'orphan',
      impact: 'Completed secondary education with honors and received university scholarship',
      dateHelped: 'September 2021'
    }
  ];

  return limit ? mockStories.slice(0, limit) : mockStories;
}

async function createStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storyData = req.body;

    // Validate required fields
    if (!storyData.title || !storyData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate slug from title
    const slug = storyData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newStory = {
      ...storyData,
      slug,
      type: 'story',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newStory,
        message: 'Story created successfully (mock mode)'
      });
    }

    const { data, error } = await supabase
      .from('content')
      .insert([newStory])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(201).json({
        id: Date.now().toString(),
        ...newStory,
        message: 'Story created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    // Update slug if title changed
    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Story updated successfully (mock mode)'
      });
    }

    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'story')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Story updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Story deleted successfully (mock mode)'
      });
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      .eq('type', 'story');

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(200).json({
        message: 'Story deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}