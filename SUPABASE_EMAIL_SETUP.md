# Supabase Email Setup (Option A - True Supabase Implementation)

This is the TRUE Supabase email implementation using **Supabase Edge Functions + Resend API**.

## What You Requested

**Option A: Supabase Email** ✅ IMPLEMENTED

## Architecture

```
Volunteer Form → Next.js API → Supabase Edge Function → Resend API → Email Delivered
```

## Quick Setup (3 Steps)

### 1. Get Resend API Key
```
Visit: https://resend.com/signup
FREE: 3,000 emails/month
```

### 2. Deploy Edge Function
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy
supabase functions deploy send-volunteer-email

# Set secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
supabase secrets set ADMIN_EMAIL=admin@saintlammyfoundation.org
```

### 3. Done!
Emails will now send automatically when volunteers apply.

## Files Created

- ✅ `supabase/functions/send-volunteer-email/index.ts` - Edge function
- ✅ `lib/email.ts` - Updated to use Edge Functions
- ✅ `pages/api/volunteer.ts` - Integrated email sending

## Current Status

📧 **Console Logging Mode** (until you deploy Edge Function)
- Form submissions work
- Emails logged to terminal
- No actual emails sent yet

🚀 **After Deployment** 
- Real emails sent via Resend
- Volunteer gets confirmation
- Admin gets notification

## Deploy Commands

```bash
supabase functions deploy send-volunteer-email
supabase secrets set RESEND_API_KEY=your_key_here
```

Done! This is the official Supabase approach for custom emails.
