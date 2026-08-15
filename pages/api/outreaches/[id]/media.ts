import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { getOptionalAdmin } from '@/lib/serverAuth';

function readInlineImage(value: unknown) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0 || buffer.length > 12 * 1024 * 1024) return null;
  return { contentType: match[1], buffer };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!supabaseAdmin) return res.status(503).json({ error: 'Media service unavailable' });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const field = Array.isArray(req.query.field) ? req.query.field[0] : req.query.field;
  const index = Number(Array.isArray(req.query.index) ? req.query.index[0] : req.query.index || 0);
  if (!id || !['image', 'gallery', 'testimonial'].includes(String(field)) || !Number.isInteger(index) || index < 0 || index > 100) {
    return res.status(400).json({ error: 'Invalid media request' });
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('outreach_reports')
    .select('status, image, gallery, testimonials')
    .eq('outreach_id', id)
    .maybeSingle();
  if (error || !data) return res.status(404).json({ error: 'Media not found' });

  if (data.status === 'draft' && !(await getOptionalAdmin(req))) {
    return res.status(404).json({ error: 'Media not found' });
  }

  const gallery = typeof data.gallery === 'string' ? JSON.parse(data.gallery) : data.gallery || [];
  const testimonials = typeof data.testimonials === 'string' ? JSON.parse(data.testimonials) : data.testimonials || [];
  const source = field === 'image' ? data.image : field === 'gallery' ? gallery[index] : testimonials[index]?.image;
  const image = readInlineImage(source);
  if (!image) return res.status(404).json({ error: 'Media not found' });

  res.setHeader('Content-Type', image.contentType);
  res.setHeader('Content-Length', String(image.buffer.length));
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');
  return res.status(200).send(image.buffer);
}
