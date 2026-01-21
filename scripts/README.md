# Database Seeding Scripts

This directory contains scripts for populating the database with initial example content.

## Available Scripts

### `seed-example-programs.ts`

Seeds the database with 4 example programs that demonstrate the platform's capabilities.

**Programs included:**
1. Orphan Adoption Program
2. Widow Empowerment Initiative
3. Educational Excellence Program
4. Healthcare Access Program

**Usage:**

```bash
npx ts-node scripts/seed-example-programs.ts
```

**Features:**
- Automatically checks if programs already exist (no duplicates)
- Programs are marked with `is_example: true` in `program_details`
- Includes full content, images, categories, beneficiaries, and budget data
- Can be edited or deleted from the admin dashboard like any other program

**When to use:**
- Fresh database setup
- After database reset
- For development/testing environments
- When no programs exist and you need example content

**Environment Requirements:**
- `SUPABASE_URL` must be set
- `SUPABASE_SERVICE_ROLE_KEY` must be set (for admin access)

**Database Structure:**
Programs are inserted into the `content` table with:
- `type: 'program'`
- `status: 'published'`
- `program_details` JSONB field containing:
  - `category`: Program category
  - `target_audience`: Who the program serves
  - `beneficiaries`: Number of people helped
  - `monthlyBudget`: Monthly budget in Naira
  - `is_example`: Set to `true` for seeded programs
  - `features`: Array of program features
  - `impact`: Object with impact metrics

## Creating New Seeding Scripts

Follow this template for new seeding scripts:

```typescript
import { supabaseAdmin } from '../lib/supabase';

const exampleData = [
  // Your data here
];

async function seedFunction() {
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available');
    process.exit(1);
  }

  try {
    // Check for existing data
    // Insert new data
    // Report success
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedFunction()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
```

## Notes

- Always use `supabaseAdmin` for seeding (bypasses RLS)
- Include existence checks to prevent duplicates
- Provide clear console output for debugging
- Mark example/seed data appropriately for easy identification
- Ensure seeded data can be managed through the admin UI
