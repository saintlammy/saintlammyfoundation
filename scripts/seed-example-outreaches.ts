/**
 * Seed Example Outreaches Script
 *
 * This script adds example outreach programs (both past and upcoming) to the database.
 * Run this once to populate the database with initial content.
 *
 * Usage: npx tsx scripts/seed-example-outreaches.ts
 */

// Use CommonJS require for Node.js script
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local since dotenv is not installed
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line: string) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
  console.log('✅ Loaded environment variables from .env.local');
} else {
  console.log('⚠️  .env.local not found, using existing environment variables');
}

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  console.error('\n💡 Make sure .env.local exists with these variables');
  console.error('💡 Or export them in your shell before running this script');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase admin client initialized');

const exampleOutreaches = [
  // Past completed outreaches
  {
    id: 'example-outreach-1',
    title: 'Independence Day Medical Outreach',
    slug: 'independence-day-medical-outreach',
    content: 'Free medical check-ups, medications, and health education for underserved communities. This outreach provided comprehensive healthcare services to 450 people in the Ikeja area.',
    excerpt: 'Free medical check-ups, medications, and health education for underserved communities.',
    type: 'outreach',
    status: 'completed',
    featured_image: '/images/nigerian-ngo/health-outreach.webp',
    outreach_details: {
      date: 'October 1, 2024',
      location: 'Ikeja, Lagos',
      beneficiaries: 450,
      is_example: true,
      impact: [
        '450 people received medical care',
        '200 medications distributed',
        '50 referrals to specialists'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'example-outreach-2',
    title: 'Back-to-School Support',
    slug: 'back-to-school-support',
    content: 'School supplies and uniforms distribution for children from vulnerable families. This program supported 320 children across multiple locations to ensure they were prepared for the school year.',
    excerpt: 'School supplies and uniforms distribution for children from vulnerable families.',
    type: 'outreach',
    status: 'completed',
    featured_image: '/images/nigerian-ngo/education-classroom.webp',
    outreach_details: {
      date: 'September 12, 2024',
      location: 'Multiple Locations',
      beneficiaries: 320,
      is_example: true,
      impact: [
        '320 children received school supplies',
        '150 uniforms distributed',
        '8 schools supported'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'example-outreach-3',
    title: 'Clean Water Initiative',
    slug: 'clean-water-initiative',
    content: 'Installation of water pumps and distribution of water purification tablets. This initiative brought clean water access to 600 people in rural Kogi State.',
    excerpt: 'Installation of water pumps and distribution of water purification tablets.',
    type: 'outreach',
    status: 'completed',
    featured_image: '/images/nigerian-ngo/community-relief.webp',
    outreach_details: {
      date: 'August 20, 2024',
      location: 'Rural Kogi State',
      beneficiaries: 600,
      is_example: true,
      impact: [
        '3 water pumps installed',
        '600 people gained access to clean water',
        '1200 purification tablets distributed'
      ]
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function seedExampleOutreaches() {
  console.log('🌱 Starting to seed example outreaches...');

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
    process.exit(1);
  }

  try {
    // Check if example outreaches already exist
    const { data: existing, error: checkError } = await (supabaseAdmin
      .from('content') as any)
      .select('id')
      .eq('type', 'outreach')
      .in('id', exampleOutreaches.map(o => o.id));

    if (checkError) {
      console.error('❌ Error checking existing outreaches:', checkError);
      throw checkError;
    }

    const existingIds = existing?.map((o: any) => o.id) || [];
    const outreachesToInsert = exampleOutreaches.filter(o => !existingIds.includes(o.id));

    if (outreachesToInsert.length === 0) {
      console.log('✅ Example outreaches already exist in database. No seeding needed.');
      return;
    }

    console.log(`📝 Inserting ${outreachesToInsert.length} example outreaches...`);

    // Insert outreaches
    const { data, error } = await (supabaseAdmin
      .from('content') as any)
      .insert(outreachesToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting outreaches:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${outreachesToInsert.length} example outreaches!`);
    console.log('📊 Outreach IDs:', outreachesToInsert.map(o => o.id).join(', '));
    console.log('\n💡 These outreaches can now be edited or deleted from the admin dashboard.');
    console.log('💡 They are marked with is_example: true in outreach_details.');

  } catch (error) {
    console.error('❌ Failed to seed outreaches:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedExampleOutreaches()
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
