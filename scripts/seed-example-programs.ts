/**
 * Seed Example Programs Script
 *
 * This script adds example/demo programs to the database that admins can edit or delete.
 * Run this once to populate the database with initial content.
 *
 * Usage: npx tsx scripts/seed-example-programs.ts
 */

// Use CommonJS require for Node.js script
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local since dotenv is not installed
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
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

const examplePrograms = [
  {
    id: 'example-program-1',
    title: 'Orphan Adoption Program',
    slug: 'orphan-adoption-program',
    content: 'Comprehensive support system for orphaned children including education, healthcare, housing, and emotional support. This program provides holistic care addressing physical, emotional, and educational needs of vulnerable children.',
    excerpt: 'Comprehensive support system for orphaned children including education, healthcare, housing, and emotional support.',
    type: 'program',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    program_details: {
      category: 'Child Welfare',
      target_audience: 'Orphaned Children',
      beneficiaries: 300,
      monthlyBudget: 450000,
      is_example: true,
      features: [
        'Educational scholarships and school supplies',
        'Medical care and health insurance',
        'Psychological counseling and mentorship',
        'Skills training and career guidance',
        'Housing support in partner orphanages'
      ],
      impact: {
        'Children Supported': '300+',
        'Educational Success Rate': '85%',
        'Health Outcomes': '95% improved',
        'Monthly Budget': '₦450,000'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'example-program-2',
    title: 'Widow Empowerment Initiative',
    slug: 'widow-empowerment-initiative',
    content: 'Economic empowerment program helping widows become financially independent through skills training and micro-business support. Includes tailoring, soap making, business management training, and access to micro-loans.',
    excerpt: 'Economic empowerment program helping widows become financially independent through skills training and micro-business support.',
    type: 'program',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    program_details: {
      category: 'Economic Empowerment',
      target_audience: 'Widows',
      beneficiaries: 500,
      monthlyBudget: 320000,
      is_example: true,
      features: [
        'Tailoring and fashion design training',
        'Soap making and cosmetics production',
        'Small business management courses',
        'Micro-loan access and financial literacy',
        'Market linkage and sales support'
      ],
      impact: {
        'Widows Empowered': '500+',
        'Businesses Started': '180',
        'Income Increase': '65% average',
        'Monthly Budget': '₦320,000'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'example-program-3',
    title: 'Educational Excellence Program',
    slug: 'educational-excellence-program',
    content: 'Scholarship program and educational support for children from vulnerable families to ensure quality education access. Provides full and partial scholarships, school supplies, computer literacy training, and university placement support.',
    excerpt: 'Scholarship program and educational support for children from vulnerable families to ensure quality education access.',
    type: 'program',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    program_details: {
      category: 'Education',
      target_audience: 'Vulnerable Children',
      beneficiaries: 450,
      monthlyBudget: 280000,
      is_example: true,
      features: [
        'Full and partial scholarships',
        'School supplies and uniforms',
        'Computer literacy training',
        'After-school tutoring programs',
        'University placement support'
      ],
      impact: {
        'Students Supported': '450+',
        'Graduation Rate': '92%',
        'University Admissions': '78%',
        'Monthly Budget': '₦280,000'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'example-program-4',
    title: 'Healthcare Access Program',
    slug: 'healthcare-access-program',
    content: 'Providing healthcare services and medical support to underserved communities through mobile clinics and health education. Offers free medical consultations, medications, maternal and child health services, and mental health support.',
    excerpt: 'Providing healthcare services and medical support to underserved communities through mobile clinics and health education.',
    type: 'program',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    program_details: {
      category: 'Healthcare',
      target_audience: 'Underserved Communities',
      beneficiaries: 1200,
      monthlyBudget: 380000,
      is_example: true,
      features: [
        'Mobile medical clinics',
        'Free medications and treatments',
        'Health education and prevention',
        'Maternal and child health services',
        'Mental health support and counseling'
      ],
      impact: {
        'Patients Treated': '1,200+',
        'Medical Consultations': '3,500+',
        'Lives Saved': '25+',
        'Monthly Budget': '₦380,000'
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function seedExamplePrograms() {
  console.log('🌱 Starting to seed example programs...');

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.');
    process.exit(1);
  }

  try {
    // Check if example programs already exist
    const { data: existing, error: checkError } = await (supabaseAdmin
      .from('content') as any)
      .select('id')
      .eq('type', 'program')
      .in('id', examplePrograms.map(p => p.id));

    if (checkError) {
      console.error('❌ Error checking existing programs:', checkError);
      throw checkError;
    }

    const existingIds = existing?.map((p: any) => p.id) || [];
    const programsToInsert = examplePrograms.filter(p => !existingIds.includes(p.id));

    if (programsToInsert.length === 0) {
      console.log('✅ Example programs already exist in database. No seeding needed.');
      return;
    }

    console.log(`📝 Inserting ${programsToInsert.length} example programs...`);

    // Insert programs
    const { data, error } = await (supabaseAdmin
      .from('content') as any)
      .insert(programsToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting programs:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${programsToInsert.length} example programs!`);
    console.log('📊 Program IDs:', programsToInsert.map(p => p.id).join(', '));
    console.log('\n💡 These programs can now be edited or deleted from the admin dashboard.');
    console.log('💡 They are marked with is_example: true in program_details.');

  } catch (error) {
    console.error('❌ Failed to seed programs:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedExamplePrograms()
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
