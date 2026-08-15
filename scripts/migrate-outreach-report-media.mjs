import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const bucketName = 'outreach-media';
const bucketResult = await client.storage.createBucket(bucketName, {
  public: true,
  fileSizeLimit: 12 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
});
if (bucketResult.error && !/already exists/i.test(bucketResult.error.message)) throw bucketResult.error;

function parseJson(value, fallback) {
  if (typeof value !== 'string') return value ?? fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

async function moveImage(value, outreachId, label) {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return value;
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error(`Unsupported inline image in ${outreachId}/${label}`);
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length > 12 * 1024 * 1024) throw new Error(`${outreachId}/${label} exceeds 12 MB`);
  const extension = match[1] === 'image/jpeg' ? 'jpg' : match[1].split('/')[1];
  const safeId = outreachId.replace(/[^a-zA-Z0-9_-]/g, '-');
  const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, '-');
  const path = `${safeId}/migrated-${safeLabel}.${extension}`;
  const { error } = await client.storage.from(bucketName).upload(path, bytes, {
    contentType: match[1],
    cacheControl: '31536000',
    upsert: true
  });
  if (error) throw error;
  return client.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
}

const { data: reports, error: reportsError } = await client
  .from('outreach_reports')
  .select('id, outreach_id, image, gallery, testimonials');
if (reportsError) throw reportsError;

let updated = 0;
for (const report of reports || []) {
  const gallery = parseJson(report.gallery, []);
  const testimonials = parseJson(report.testimonials, []);
  const nextImage = await moveImage(report.image, report.outreach_id, 'cover');
  const nextGallery = await Promise.all(gallery.map((image, index) => moveImage(image, report.outreach_id, `gallery-${index + 1}`)));
  const nextTestimonials = await Promise.all(testimonials.map(async (testimonial, index) => ({
    ...testimonial,
    image: await moveImage(testimonial.image, report.outreach_id, `testimonial-${index + 1}`)
  })));
  const changed = nextImage !== report.image
    || nextGallery.some((image, index) => image !== gallery[index])
    || nextTestimonials.some((testimonial, index) => testimonial.image !== testimonials[index]?.image);
  if (!changed) continue;
  const { error } = await client.from('outreach_reports').update({
    image: nextImage,
    gallery: JSON.stringify(nextGallery),
    testimonials: JSON.stringify(nextTestimonials),
    updated_at: new Date().toISOString()
  }).eq('id', report.id);
  if (error) throw error;
  updated += 1;
}

console.log(`Migrated inline media for ${updated} outreach report${updated === 1 ? '' : 's'}.`);
