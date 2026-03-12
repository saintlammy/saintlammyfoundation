# Vulnerable Homes Campaign System

## Overview

The Vulnerable Homes Campaign System is a comprehensive feature that extends the existing campaigns functionality to support **profile-based storytelling campaigns**. This allows the foundation to showcase individual families and homes with detailed stories, enabling targeted sponsorship and donations.

---

## Features

### ✅ **Database Layer**
- **Campaign Profiles Table** (`campaign_profiles`) - Stores individual beneficiary/home profiles
- **Campaign Type Field** - Extends `campaigns` table with `campaign_type` enum
- **Relationships** - One campaign → Many profiles (one-to-many)
- **Flexible Metadata** - JSONB field for extensible profile data
- **Auto-generated Timestamps** - Tracks creation and updates
- **Profile Codes** - Human-readable unique identifiers (e.g., VH-001, VH-002)

### ✅ **Backend APIs**
- **`/api/campaign-profiles`** - Full CRUD operations for profiles
  - `GET` - List/filter profiles by campaign, status, tags, featured flag
  - `POST` - Create new profile
  - `PUT` - Update existing profile
  - `DELETE` - Delete profile
- **`/api/campaigns`** - Enhanced with `campaign_type` and `profile_count` fields
- **Mock Data Fallback** - Graceful degradation when database unavailable

### ✅ **Admin Dashboard**
- **Campaign Profiles Management** (`/admin/content/campaign-profiles`)
  - Visual profile cards with preview
  - Advanced filtering (campaign, status, search)
  - Real-time statistics (total, active, sponsors, funding)
  - Rich editor modal with:
    - Story snippet & full story (separate fields)
    - Tag management
    - Image & video URL support
    - Funding goal tracking
    - Sort order control
    - Status management

### ✅ **Public Frontend**
- **Vulnerable Homes Page** (`/campaigns/vulnerable-homes`)
  - Profile cards grid layout
  - Read full story modal
  - Sponsor button with donation integration
  - Responsive design (mobile-first)
  - SEO-optimized with OpenGraph tags
  - Social sharing support

### ✅ **Reusable Components**
- **`ProfileCard`** - Card component with image, story snippet, tags, sponsor CTA
- **`ProfileDetailModal`** - Full-screen modal with complete story, video support
- **Export Module** - `components/campaigns/index.ts` for easy imports

### ✅ **Donation Integration**
- **Profile Sponsorship** - Link donations to specific profiles via `metadata`
- **Category Support** - Added 'home' category to donation system
- **Context Tracking** - Track profile_id, profile_code in donation metadata
- **Donation Modal Integration** - Pre-fill donor context with profile details

---

## Database Schema

### Campaign Profiles Table

```sql
CREATE TABLE campaign_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

  -- Profile Information
  profile_code VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  descriptor VARCHAR(200),

  -- Story Content
  story_snippet TEXT NOT NULL, -- For card display
  story_full TEXT NOT NULL, -- For detail modal
  how_your_gift_helps TEXT,

  -- Media
  image_url TEXT,
  video_url TEXT,

  -- Categorization
  tags TEXT[],

  -- Status & Display
  status VARCHAR(20) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,

  -- Fundraising
  funding_goal DECIMAL(12, 2),
  current_funding DECIMAL(12, 2) DEFAULT 0,
  sponsor_count INTEGER DEFAULT 0,

  -- Flexible metadata
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campaigns Table Extension

```sql
ALTER TABLE campaigns
  ADD COLUMN campaign_type VARCHAR(30) DEFAULT 'general'
    CHECK (campaign_type IN ('general', 'vulnerable_homes', 'emergency', 'seasonal'));
```

---

## API Documentation

### Get Campaign Profiles

```http
GET /api/campaign-profiles
```

**Query Parameters:**
- `id` (string) - Get single profile by ID
- `campaign_id` (string) - Filter by campaign
- `status` (string) - Filter by status (active, inactive, draft, archived)
- `featured` (boolean) - Filter featured profiles only
- `tags` (string | string[]) - Filter by tags
- `limit` (number) - Limit results

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "campaign_id": "uuid",
      "profile_code": "VH-001",
      "title": "Serah — Carrying Two Futures Alone",
      "descriptor": "Single mother of two children",
      "story_snippet": "Short story...",
      "story_full": "Full story...",
      "how_your_gift_helps": "Impact statement...",
      "tags": ["Food Support", "Hygiene", "Education"],
      "image_url": "https://...",
      "video_url": "https://...",
      "status": "active",
      "is_featured": true,
      "sort_order": 1,
      "funding_goal": null,
      "current_funding": 0,
      "sponsor_count": 0,
      "metadata": {},
      "created_at": "2026-03-12T...",
      "updated_at": "2026-03-12T..."
    }
  ]
}
```

### Create Campaign Profile

```http
POST /api/campaign-profiles
```

**Body:**
```json
{
  "campaign_id": "uuid",
  "profile_code": "VH-005",
  "title": "Profile Title",
  "descriptor": "Short descriptor",
  "story_snippet": "Short story for cards...",
  "story_full": "Full story for modal...",
  "how_your_gift_helps": "Impact statement...",
  "tags": ["Tag1", "Tag2"],
  "image_url": "https://...",
  "status": "active",
  "is_featured": false,
  "sort_order": 5
}
```

### Update Campaign Profile

```http
PUT /api/campaign-profiles?id={profile_id}
```

**Body:** (any fields to update)

### Delete Campaign Profile

```http
DELETE /api/campaign-profiles?id={profile_id}
```

---

## TypeScript Types

```typescript
export interface CampaignProfile {
  id: string;
  campaign_id: string;
  profile_code: string;
  title: string;
  descriptor: string;
  story_snippet: string;
  story_full: string;
  how_your_gift_helps: string;
  tags: string[];
  image_url?: string;
  video_url?: string;
  status: 'active' | 'inactive' | 'archived' | 'draft';
  is_featured: boolean;
  sort_order: number;
  funding_goal?: number;
  current_funding: number;
  sponsor_count: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  // ... existing fields
  campaign_type?: 'general' | 'vulnerable_homes' | 'emergency' | 'seasonal';
  profile_count?: number;
  profiles?: CampaignProfile[];
}
```

---

## Component Usage

### ProfileCard

```tsx
import { ProfileCard } from '@/components/campaigns';

<ProfileCard
  profile={profile}
  onReadMore={(profile) => {
    // Handle read more
  }}
  onSponsor={(profile) => {
    // Handle sponsor
  }}
/>
```

### ProfileDetailModal

```tsx
import { ProfileDetailModal } from '@/components/campaigns';

<ProfileDetailModal
  profile={selectedProfile}
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSponsor={(profile) => {
    // Handle sponsor
  }}
/>
```

---

## Page Routes

| Route | Description | Type |
|-------|-------------|------|
| `/campaigns/vulnerable-homes` | Public campaign page | Public |
| `/admin/content/campaign-profiles` | Admin management | Admin |
| `/campaign/[id]` | Individual campaign details | Public |

---

## Workflow

### For Admins

1. **Create Campaign**
   - Go to `/admin/campaigns` (if exists) or via API
   - Set `campaign_type` = 'vulnerable_homes'

2. **Add Profiles**
   - Go to `/admin/content/campaign-profiles`
   - Click "Add Profile"
   - Fill in profile details:
     - Select campaign
     - Enter profile code (e.g., VH-001)
     - Write title, descriptor
     - Write story snippet (150-200 chars for cards)
     - Write full story (complete narrative)
     - Add "How Your Gift Helps" statement
     - Add tags
     - Upload image/video
     - Set status, featured flag, sort order
   - Save profile

3. **Manage Profiles**
   - View all profiles in grid/list
   - Edit existing profiles
   - Delete profiles (with confirmation)
   - Filter by campaign, status, search
   - Track stats (total, active, sponsors, funding)

### For Donors

1. **Visit Campaign Page**
   - Navigate to `/campaigns/vulnerable-homes`

2. **Browse Profiles**
   - See all active profile cards
   - Read story snippets
   - View tags (Food Support, Education, etc.)

3. **Read Full Story**
   - Click "Read Full Story" button
   - Modal opens with complete narrative
   - View image/video (if available)
   - See funding progress (if goal set)

4. **Sponsor**
   - Click "Sponsor" button
   - Donation modal opens pre-filled with:
     - Profile title
     - Impact statement
     - Category = 'home'
     - Profile metadata for tracking
   - Complete donation

5. **Share**
   - Share campaign via social media
   - Native share API support on mobile

---

## Database Setup

1. **Run Schema Migration**
   ```bash
   # In your Supabase SQL Editor, run:
   database/campaign_profiles_schema.sql
   ```

2. **Verify Tables**
   - `campaign_profiles` table created
   - `campaigns.campaign_type` column added
   - Sample data inserted (4 profiles, 1 campaign)

3. **Row Level Security (Optional)**
   - Public read access for active profiles
   - Admin write access only

---

## Mock Data (Fallback)

When database is unavailable, the system uses hardcoded mock data:
- 1 Vulnerable Homes campaign
- 4 profile examples:
  - VH-001: Serah (Single mother)
  - VH-002: Mr. Alagbe (Older father with debt)
  - VH-003: Olusegun (Family with special needs)
  - VH-004: Monsuru (Father of five girls)

---

## Best Practices

### Story Writing
- **Story Snippet**: 150-200 characters, emotional hook
- **Full Story**: 2-3 paragraphs, complete narrative with context
- **How Your Gift Helps**: Specific, actionable impact statement

### Tags
- Use consistent tag naming (Title Case)
- Common tags: Food Support, Hygiene, Education, Healthcare, Family Relief, Caregiving, Stability

### Profile Codes
- Format: `{PREFIX}-{NUMBER}` (e.g., VH-001)
- PREFIX by campaign type:
  - VH = Vulnerable Homes
  - WS = Widow Support
  - ED = Education
- Sequential numbering within campaign

### Images
- Recommended size: 1200x800px (3:2 aspect ratio)
- Formats: JPG, PNG, WebP
- Alt text: Auto-generated from title
- Respect privacy: Avoid identifiable faces without consent

---

## Future Enhancements

### Phase 2 (Recommended)
- [ ] Profile-level donation tracking dashboard
- [ ] Sponsor wall (public donor recognition)
- [ ] Email notifications to profile sponsors
- [ ] Monthly impact reports per profile
- [ ] Profile milestone notifications

### Phase 3 (Advanced)
- [ ] Individual profile pages (`/profiles/[id]`)
- [ ] QR codes for offline fundraising
- [ ] WhatsApp integration for Nigerian audience
- [ ] Multi-language support (Yoruba, Igbo)
- [ ] Video testimonial uploads
- [ ] Recurring sponsorship (monthly auto-debit)

### Phase 4 (Analytics)
- [ ] Profile engagement tracking (views, clicks, donations)
- [ ] A/B testing for story snippets
- [ ] Geographic sponsor distribution
- [ ] Conversion funnel analysis

---

## Troubleshooting

### Profiles not loading
1. Check database connection (`.env` variables)
2. Verify `campaign_profiles` table exists
3. Check browser console for API errors
4. Confirm campaign has `campaign_type = 'vulnerable_homes'`

### Donation modal not opening
1. Verify `DonationModalProvider` wraps app
2. Check `useDonationModal` hook import
3. Confirm category 'home' is supported

### TypeScript errors
1. Run `npm run typecheck`
2. Verify `types/index.ts` includes `CampaignProfile` type
3. Check Supabase client type assertions (`as any`)

---

## Files Created/Modified

### Created Files
- `database/campaign_profiles_schema.sql`
- `pages/api/campaign-profiles.ts`
- `pages/campaigns/vulnerable-homes.tsx`
- `pages/admin/content/campaign-profiles.tsx`
- `components/campaigns/ProfileCard.tsx`
- `components/campaigns/ProfileDetailModal.tsx`
- `components/campaigns/index.ts`
- `VULNERABLE_HOMES_CAMPAIGN.md` (this file)

### Modified Files
- `types/index.ts` - Added `CampaignProfile` and extended `Campaign` types
- `pages/api/campaigns.ts` - Added `campaign_type`, `profile_count`, mock data
- `components/DonationModalProvider.tsx` - Added 'home' category, metadata field

---

## Support

For questions or issues with the Vulnerable Homes Campaign System:
1. Check this documentation
2. Review API error logs (`console.log` in API routes)
3. Test with mock data (disconnect database)
4. Verify database schema matches documentation

---

**Last Updated:** March 12, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
