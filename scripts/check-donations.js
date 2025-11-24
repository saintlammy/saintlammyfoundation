// Script to check donations in Supabase database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zvbxzdhevudsrhxmkncg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Ynh6ZGhldnVkc3JoeG1rbmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzYyMDMsImV4cCI6MjA3NDMxMjIwM30.M7BxL7RCjgITZ6pES5v7R5YI_42xsXngPn9AYoOYV3E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDonations() {
  console.log('🔍 Checking donations in Supabase...\n');

  try {
    // Get all donations
    const { data: donations, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching donations:', error);
      return;
    }

    if (!donations || donations.length === 0) {
      console.log('📭 No donations found in database');
      return;
    }

    console.log(`✅ Found ${donations.length} donation(s):\n`);

    donations.forEach((donation, index) => {
      console.log(`--- Donation ${index + 1} ---`);
      console.log(`ID: ${donation.id}`);
      console.log(`Amount: ${donation.currency} ${donation.amount}`);
      console.log(`Status: ${donation.status}`);
      console.log(`Payment Method: ${donation.payment_method}`);
      console.log(`Category: ${donation.category}`);
      console.log(`TX Hash: ${donation.tx_hash || 'N/A'}`);
      console.log(`Created: ${donation.created_at}`);
      console.log(`Processed: ${donation.processed_at || 'N/A'}`);

      // Parse notes if exists
      if (donation.notes) {
        try {
          const notes = typeof donation.notes === 'string' ? JSON.parse(donation.notes) : donation.notes;
          console.log(`Network: ${notes.network || 'N/A'}`);
          console.log(`Crypto Amount: ${notes.cryptoAmount || 'N/A'}`);
          console.log(`Wallet: ${notes.walletAddress || 'N/A'}`);
        } catch (e) {
          console.log(`Notes: ${donation.notes}`);
        }
      }
      console.log('');
    });

    // Get stats
    const completed = donations.filter(d => d.status === 'completed').length;
    const pending = donations.filter(d => d.status === 'pending').length;
    const total = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

    console.log('📊 Summary:');
    console.log(`Total donations: ${donations.length}`);
    console.log(`Completed: ${completed}`);
    console.log(`Pending: ${pending}`);
    console.log(`Total amount: $${total.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDonations();
