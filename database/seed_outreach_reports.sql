-- Seed Data for Outreach Reports
-- Run this AFTER creating the outreach_reports table
-- This populates the database with the existing mock data

-- Clear existing data (optional - only if you want to start fresh)
-- DELETE FROM outreach_reports WHERE outreach_id IN ('4', '5', '6');

-- Insert Independence Day Medical Outreach (ID 4)
INSERT INTO outreach_reports (
  outreach_id,
  title,
  date,
  location,
  status,
  image,
  description,
  target_beneficiaries,
  actual_beneficiaries,
  beneficiary_categories,
  impact,
  budget,
  volunteers,
  activities,
  gallery,
  testimonials,
  future_plans,
  partners,
  report_document,
  social_media
) VALUES (
  '4',
  'Independence Day Medical Outreach 2024',
  '2024-10-01',
  'Ikeja, Lagos State',
  'completed',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'Our flagship medical outreach program providing free healthcare services, medical check-ups, medications, and health education to underserved communities in Ikeja, Lagos.',
  400,
  487,
  '[
    {"category": "Children (0-12)", "count": 145},
    {"category": "Teenagers (13-17)", "count": 68},
    {"category": "Adults (18-60)", "count": 189},
    {"category": "Elderly (60+)", "count": 85}
  ]'::jsonb,
  '[
    {"title": "Medical Consultations", "value": 487, "description": "Free consultations provided"},
    {"title": "Medications Distributed", "value": 234, "description": "Essential medications given"},
    {"title": "Health Screenings", "value": 312, "description": "Blood pressure, diabetes, malaria tests"},
    {"title": "Specialist Referrals", "value": 56, "description": "Referred to partner hospitals"},
    {"title": "Eyeglasses Provided", "value": 42, "description": "Free prescription glasses"},
    {"title": "Dental Check-ups", "value": 89, "description": "Free dental examinations"}
  ]'::jsonb,
  '{
    "planned": 2500000,
    "actual": 2340000,
    "breakdown": [
      {"category": "Medical Supplies", "amount": 980000, "percentage": 42},
      {"category": "Medications", "amount": 750000, "percentage": 32},
      {"category": "Personnel/Volunteers", "amount": 350000, "percentage": 15},
      {"category": "Logistics & Transport", "amount": 160000, "percentage": 7},
      {"category": "Marketing & Outreach", "amount": 100000, "percentage": 4}
    ]
  }'::jsonb,
  '{
    "registered": 45,
    "participated": 38,
    "hours": 304
  }'::jsonb,
  '[
    {"title": "Registration & Triage", "description": "Patient registration and initial screening", "completed": true},
    {"title": "General Medical Consultation", "description": "Consultations with general practitioners", "completed": true},
    {"title": "Blood Pressure & Diabetes Screening", "description": "Free health screenings for all attendees", "completed": true},
    {"title": "Malaria Testing", "description": "Rapid diagnostic tests for malaria", "completed": true},
    {"title": "Medication Distribution", "description": "Free essential medications dispensing", "completed": true},
    {"title": "Dental Check-ups", "description": "Basic dental examinations", "completed": true},
    {"title": "Eye Care Services", "description": "Vision tests and eyeglasses distribution", "completed": true},
    {"title": "Health Education Sessions", "description": "Community health awareness talks", "completed": true},
    {"title": "Nutritional Counseling", "description": "Dietary advice and nutrition support", "completed": true},
    {"title": "Follow-up Referrals", "description": "Specialist hospital referrals for critical cases", "completed": true}
  ]'::jsonb,
  '[
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800"
  ]'::jsonb,
  '[
    {
      "name": "Mrs. Folake Adeyemi",
      "role": "Beneficiary",
      "message": "I received free medication for my diabetes and blood pressure. The doctors were very professional and caring. God bless Saintlammy Foundation!",
      "image": "https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?w=400"
    },
    {
      "name": "Mr. Chukwudi Okonkwo",
      "role": "Volunteer Doctor",
      "message": "It was a privilege to serve alongside such dedicated volunteers. The organization and impact were truly remarkable.",
      "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
    },
    {
      "name": "Miss Aisha Mohammed",
      "role": "Community Leader",
      "message": "This outreach brought hope to our community. Many people who cannot afford healthcare received much-needed medical attention.",
      "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    }
  ]'::jsonb,
  '[
    "Expand medical outreach to 3 more communities in Q1 2025",
    "Partner with additional hospitals for specialist referrals",
    "Establish mobile clinic for hard-to-reach rural areas",
    "Launch follow-up program to track patient outcomes",
    "Create health education video series in local languages"
  ]'::jsonb,
  '[
    {"name": "Lagos State Ministry of Health", "contribution": "Medical personnel and supplies support"},
    {"name": "Reddington Hospital", "contribution": "Specialist referral partnership"},
    {"name": "PharmAccess Foundation", "contribution": "Medication donations"}
  ]'::jsonb,
  '/reports/independence-day-medical-outreach-2024.pdf',
  '[
    {"platform": "Facebook", "reach": 12500, "engagement": 1850},
    {"platform": "Instagram", "reach": 8300, "engagement": 2100},
    {"platform": "Twitter", "reach": 5600, "engagement": 980}
  ]'::jsonb
)
ON CONFLICT (outreach_id) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  location = EXCLUDED.location,
  status = EXCLUDED.status,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  target_beneficiaries = EXCLUDED.target_beneficiaries,
  actual_beneficiaries = EXCLUDED.actual_beneficiaries,
  beneficiary_categories = EXCLUDED.beneficiary_categories,
  impact = EXCLUDED.impact,
  budget = EXCLUDED.budget,
  volunteers = EXCLUDED.volunteers,
  activities = EXCLUDED.activities,
  gallery = EXCLUDED.gallery,
  testimonials = EXCLUDED.testimonials,
  future_plans = EXCLUDED.future_plans,
  partners = EXCLUDED.partners,
  report_document = EXCLUDED.report_document,
  social_media = EXCLUDED.social_media,
  updated_at = NOW();

-- Verify the insert
SELECT outreach_id, title, status, actual_beneficiaries
FROM outreach_reports
WHERE outreach_id = '4';
