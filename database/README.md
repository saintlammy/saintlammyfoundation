# Database Setup Guide

## Supabase Outreach Reports Table

This directory contains the SQL schema for creating the `outreach_reports` table in your Supabase database.

## Setup Instructions

### 1. Access Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project (Saintlammy Foundation)
3. Navigate to **SQL Editor** in the left sidebar

### 2. Run the Schema

1. Click **"New Query"**
2. Copy the contents of `outreach_reports_schema.sql`
3. Paste into the SQL editor
4. Click **"Run"** or press `Ctrl/Cmd + Enter`

### 3. Verify Table Creation

After running the schema, verify the table was created:

```sql
SELECT * FROM outreach_reports LIMIT 1;
```

You should see an empty result with the correct columns.

### 4. Check the Structure

To view the table structure:

```sql
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM
  information_schema.columns
WHERE
  table_name = 'outreach_reports'
ORDER BY
  ordinal_position;
```

## Table Structure

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `outreach_id` | TEXT | Unique identifier for the outreach (links to main outreach) |
| `title` | TEXT | Outreach title |
| `date` | TIMESTAMPTZ | Outreach date |
| `location` | TEXT | Outreach location |
| `status` | TEXT | Status: 'completed', 'ongoing', or 'upcoming' |
| `image` | TEXT | Featured image URL |
| `description` | TEXT | Detailed description |
| `target_beneficiaries` | INTEGER | Target number of beneficiaries |
| `actual_beneficiaries` | INTEGER | Actual number reached |
| `beneficiary_categories` | JSONB | Array of beneficiary categories |
| `impact` | JSONB | Array of impact metrics |
| `budget` | JSONB | Budget information (planned, actual, breakdown) |
| `volunteers` | JSONB | Volunteer statistics |
| `activities` | JSONB | Array of activities |
| `gallery` | JSONB | Array of image URLs |
| `testimonials` | JSONB | Array of testimonials |
| `future_plans` | JSONB | Array of future plans |
| `partners` | JSONB | Array of partner organizations |
| `report_document` | TEXT | URL to full report PDF |
| `social_media` | JSONB | Social media metrics |
| `created_at` | TIMESTAMPTZ | Creation timestamp (auto) |
| `updated_at` | TIMESTAMPTZ | Last update timestamp (auto) |

### Indexes

- `outreach_id` - For fast lookups
- `status` - For filtering by status
- `date` - For sorting by date

### Row Level Security (RLS)

The table has RLS enabled with the following policies:

- **Public Read**: Anyone can view outreach reports
- **Authenticated Insert**: Only authenticated users can create reports
- **Authenticated Update**: Only authenticated users can update reports
- **Authenticated Delete**: Only authenticated users can delete reports

## JSONB Field Structures

### beneficiary_categories
```json
[
  { "category": "Children (0-12)", "count": 145 },
  { "category": "Adults (18-60)", "count": 189 }
]
```

### impact
```json
[
  {
    "title": "Medical Consultations",
    "value": 487,
    "description": "Free consultations provided"
  }
]
```

### budget
```json
{
  "planned": 2500000,
  "actual": 2340000,
  "breakdown": [
    {
      "category": "Medical Supplies",
      "amount": 980000,
      "percentage": 42
    }
  ]
}
```

### volunteers
```json
{
  "registered": 45,
  "participated": 38,
  "hours": 304
}
```

### activities
```json
[
  {
    "title": "Registration & Triage",
    "description": "Patient registration and initial screening",
    "completed": true
  }
]
```

### testimonials
```json
[
  {
    "name": "Mrs. Folake Adeyemi",
    "role": "Beneficiary",
    "message": "Thank you for the support!",
    "image": "https://example.com/image.jpg"
  }
]
```

### partners
```json
[
  {
    "name": "Lagos State Ministry of Health",
    "logo": "https://example.com/logo.png",
    "contribution": "Medical personnel support"
  }
]
```

### social_media
```json
[
  {
    "platform": "Facebook",
    "reach": 12500,
    "engagement": 1850
  }
]
```

## Testing the Table

After creating the table, you can insert a test record:

```sql
INSERT INTO outreach_reports (
  outreach_id,
  title,
  date,
  location,
  status,
  description,
  target_beneficiaries,
  actual_beneficiaries
) VALUES (
  'test-1',
  'Test Outreach',
  NOW(),
  'Lagos, Nigeria',
  'completed',
  'This is a test outreach report',
  100,
  120
);
```

Then retrieve it:

```sql
SELECT * FROM outreach_reports WHERE outreach_id = 'test-1';
```

Clean up the test:

```sql
DELETE FROM outreach_reports WHERE outreach_id = 'test-1';
```

## Integration with Application

Once the table is created, your application will automatically use it. The API endpoints at `/api/outreaches/[id]/report` are already configured to:

1. Save reports to this table
2. Retrieve reports from this table
3. Update existing reports
4. Delete reports

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the schema SQL in the correct database
- Check that you're connected to the right Supabase project

### Error: "permission denied"
- Verify RLS policies are correctly set up
- Check that your API keys have the correct permissions

### JSONB Validation Errors
- Ensure all JSONB fields contain valid JSON
- Arrays should be `[]` not `null`
- Objects should be `{}` not `null`

## Backup

To backup your outreach reports:

```sql
COPY outreach_reports TO '/path/to/backup.csv' WITH CSV HEADER;
```

## Next Steps

After setting up the database:

1. ✅ Run the schema SQL
2. ✅ Verify table creation
3. ✅ Test with a sample insert
4. ✅ Check the admin dashboard at `/admin/content/outreach-reports`
5. ✅ Create your first outreach report!

---

**Note**: The application has a fallback system using in-memory storage, so it will work even without the database. However, data will not persist between server restarts without the database.
