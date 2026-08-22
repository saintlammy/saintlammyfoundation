import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const publishImage = async (filename) => {
  const absolutePath = path.join(process.cwd(), 'public', 'images', 'news', filename);
  const buffer = await readFile(absolutePath);
  const storagePath = `news/2026/q2/${filename}`;
  const { error } = await supabase.storage
    .from('outreach-media')
    .upload(storagePath, buffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) throw error;
  return supabase.storage.from('outreach-media').getPublicUrl(storagePath).data.publicUrl;
};

const articles = [
  {
    id: 'news-q2-widows-relief-71-reached-2026',
    title: 'Q2 Widows Relief Outreach Reaches 71 Women in Lagos',
    slug: 'q2-widows-relief-outreach-reaches-71-women-in-lagos',
    excerpt: 'Food, household essentials and targeted family support reached 71 widows during the foundation’s Q2 2026 relief outreach in Lagos.',
    content: `
      <p>Saintlammy Foundation completed its Q2 Widows Relief Outreach in Lagos on 25 July 2026, reaching 71 widows with practical food and household support.</p>
      <h2>What the outreach delivered</h2>
      <p>The relief plan covered seven bags of rice, two bags of beans, two bags of garri, vegetable oil, seasoning, salt, spaghetti and tomato paste. Each relief pack also included basic hygiene supplies such as toothpaste, bathing soap and detergent.</p>
      <p>The original distribution list covered 67 widows. Four additional relief packs were prepared during delivery, bringing the final number of women reached to 71.</p>
      <h2>Support beyond the relief packs</h2>
      <p>The outreach also provided 340 USDC toward one year of rent for a two-bedroom apartment for a widow and her three children, alongside 50 USDT in direct financial support issued in July.</p>
      <h2>Accountability and the next phase</h2>
      <p>The appeal raised $2,744 against a $2,000 target. Recorded expenditure for the completed relief activities was ₦1,938,570, approximately $1,388.66 at the reporting rate. The remaining balance was retained for the outstanding medical outreach phase for widows.</p>
      <p>We are grateful to every donor and volunteer whose support made this delivery possible.</p>
    `,
    image: 'q2-widows-relief-71-reached.webp',
    category: 'outreach',
    readTime: '3 min read',
    tags: ['Widows Relief', 'Lagos', 'Food Support', 'Q2 2026'],
    featured: true,
  },
  {
    id: 'news-q2-donor-target-exceeded-2026',
    title: 'Donors Lift Q2 Widows Appeal 37.2% Above Target',
    slug: 'donors-lift-q2-widows-appeal-above-target',
    excerpt: 'The Q2 2026 widows appeal raised $2,744—$744 above its original $2,000 target—creating room for broader relief and targeted family support.',
    content: `
      <p>The Saintlammy Foundation community raised $2,744 for the Q2 2026 Widows Relief Outreach, exceeding the original $2,000 target by $744, or 37.2%.</p>
      <h2>How the support was used</h2>
      <p>Donations funded food and household relief packs for 71 widows in Lagos. The distribution included rice, beans, garri, vegetable oil, seasoning, salt, spaghetti, tomato paste and essential hygiene items.</p>
      <p>Support also extended to a family facing housing insecurity through a 340 USDC contribution toward one year of rent for a two-bedroom apartment. A further 50 USDT was provided as direct financial support in July.</p>
      <h2>Recorded expenditure</h2>
      <p>Recorded expenditure for the completed relief activities totalled ₦1,938,570, approximately $1,388.66 at the reporting rate. The unspent balance was retained for the outstanding medical outreach phase for widows.</p>
      <p>Exceeding the target made it possible to respond to needs identified during delivery without reducing the planned relief package.</p>
    `,
    image: 'q2-donor-target-exceeded.webp',
    category: 'achievement',
    readTime: '2 min read',
    tags: ['Donor Update', 'Transparency', 'Widows Relief', 'Q2 2026'],
    featured: false,
  },
  {
    id: 'news-q2-relief-expanded-2026',
    title: 'Relief Distribution Expanded from 67 to 71 Widows',
    slug: 'relief-distribution-expanded-from-67-to-71-widows',
    excerpt: 'Four additional relief packs were added during the Q2 delivery, allowing the foundation to support every widow included at the outreach.',
    content: `
      <p>The Q2 Widows Relief Outreach was planned around an initial list of 67 women. During delivery, the foundation prepared four additional relief packs, increasing the final reach to 71 widows.</p>
      <h2>A consistent pack for every recipient</h2>
      <p>The expanded distribution retained the same practical focus. Food supplies included rice, beans, garri, vegetable oil, seasoning, salt, spaghetti and tomato paste. Toothpaste, bathing soap and detergent were also included to support everyday household needs.</p>
      <p>The adjustment was funded within the donor-supported outreach budget and ensured that the additional women could be included without removing core items from the planned packs.</p>
      <p>This responsive approach reflects the foundation’s commitment to careful preparation, dignified delivery and clear reporting after each outreach.</p>
    `,
    image: 'q2-relief-expanded.webp',
    category: 'update',
    readTime: '2 min read',
    tags: ['Relief Distribution', 'Widows', 'Lagos', 'Q2 2026'],
    featured: false,
  },
  {
    id: 'news-q2-housing-support-2026',
    title: 'One-Year Housing Support Secured for a Widow and Her Three Children',
    slug: 'one-year-housing-support-for-widow-and-three-children',
    excerpt: 'A 340 USDC housing contribution from the Q2 appeal supported one year of rent for a two-bedroom apartment for a widow and her three children.',
    content: `
      <p>Alongside the wider Q2 relief distribution, Saintlammy Foundation directed 340 USDC toward one year of rent for a two-bedroom apartment for a widow and her three children.</p>
      <h2>Responding to an urgent family need</h2>
      <p>The housing support was funded through the Q2 Widows Relief appeal and formed part of the foundation’s targeted response to needs identified around the outreach.</p>
      <p>While the main programme delivered food, household essentials and hygiene supplies to 71 widows, the rent contribution addressed a more immediate risk for one family: maintaining a stable place to live.</p>
      <p>The family’s privacy is being protected in this public update. The amount and purpose of the support are being shared as part of the foundation’s commitment to donor accountability.</p>
    `,
    image: 'q2-housing-support.webp',
    category: 'outreach',
    readTime: '2 min read',
    tags: ['Housing Support', 'Family Relief', 'Widows', 'Q2 2026'],
    featured: false,
  },
];

const timestamp = new Date().toISOString();
const rows = await Promise.all(articles.map(async (article) => ({
  id: article.id,
  type: 'news',
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  content: article.content.trim(),
  featured_image: await publishImage(article.image),
  status: 'published',
  story_details: {
    category: article.category,
    read_time: article.readTime,
    author: 'Saintlammy Foundation Team',
    tags: article.tags,
    featured: article.featured,
  },
  publish_date: '2026-07-25',
  meta_description: article.excerpt,
  meta_keywords: article.tags,
  created_at: timestamp,
  updated_at: timestamp,
})));

const { data, error } = await supabase
  .from('content')
  .upsert(rows, { onConflict: 'id' })
  .select('id, slug, status');

if (error) throw error;

console.log(`Published ${data.length} verified Q2 news articles.`);
for (const item of data) console.log(`- ${item.slug} (${item.status})`);
