# Email Notification Setup Guide

## Overview
The volunteer system now includes email notifications for:
1. **Volunteer Confirmation** - Sent to applicant after form submission
2. **Admin Notification** - Sent to admin when new application received
3. **Approval Notification** - Sent when volunteer is approved (future implementation)

## Current Status
✅ Email templates created and integrated
✅ Email service functions implemented
✅ API integration completed
⚠️ **SMTP Configuration Required** - Emails are currently logged to console only

## Setup Options

### Option A: Supabase + External SMTP (Recommended)

Since Supabase doesn't have built-in custom email sending, you need to integrate an external email service.

#### 1. Using Resend (Free: 3,000 emails/month)

**Step 1: Get Resend API Key**
```bash
# Visit https://resend.com/signup
# Create account and get API key
```

**Step 2: Install Resend**
```bash
npm install resend
```

**Step 3: Update lib/email.ts**
Replace the TODO sections with actual Resend implementation:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In sendVolunteerConfirmationEmail:
await resend.emails.send({
  from: 'Saintlammy Foundation <noreply@saintlammyfoundation.org>',
  to: data.email,
  subject: 'Thank you for applying to volunteer!',
  html: emailHtml
});

// In sendAdminNotificationEmail:
await resend.emails.send({
  from: 'Volunteer System <noreply@saintlammyfoundation.org>',
  to: ADMIN_EMAIL,
  subject: `New Volunteer Application - ${data.firstName} ${data.lastName}`,
  html: emailHtml
});
```

**Step 4: Add Environment Variables**
```env
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=admin@saintlammyfoundation.org
FOUNDATION_EMAIL=info@saintlammyfoundation.org
NEXT_PUBLIC_SITE_URL=https://saintlammyfoundation.org
```

#### 2. Using SendGrid (Free: 100 emails/day)

**Step 1: Get SendGrid API Key**
```bash
# Visit https://signup.sendgrid.com/
# Create account and get API key
```

**Step 2: Install SendGrid**
```bash
npm install @sendgrid/mail
```

**Step 3: Update lib/email.ts**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// In sendVolunteerConfirmationEmail:
await sgMail.send({
  from: 'noreply@saintlammyfoundation.org',
  to: data.email,
  subject: 'Thank you for applying to volunteer!',
  html: emailHtml
});
```

**Step 4: Add Environment Variables**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### Option B: Supabase Edge Functions

**Step 1: Create Edge Function**
```bash
npx supabase functions new send-email
```

**Step 2: Implement Email Sending in Edge Function**
```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { to, subject, html } = await req.json()

  // Use SMTP service or Resend/SendGrid
  // Implementation depends on your chosen service

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Step 3: Call Edge Function from API**
```typescript
// In lib/email.ts
const supabase = createClient(supabaseUrl, supabaseServiceKey);

await supabase.functions.invoke('send-email', {
  body: {
    to: data.email,
    subject: 'Thank you for applying to volunteer!',
    html: emailHtml
  }
});
```

## Testing Email Notifications

### 1. Console Testing (Current State)
Emails are logged to console. Check server logs after form submission:

```bash
npm run dev
# Submit volunteer form
# Check terminal for email logs
```

### 2. Test with Real Emails (After SMTP Setup)
```bash
# Submit form on localhost:3000/volunteer
# Check volunteer's email inbox
# Check admin email inbox
```

## Environment Variables Required

Add to `.env.local`:

```env
# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxx          # If using Resend
SENDGRID_API_KEY=SG.xxxxxxxxxxxx        # If using SendGrid

# Email Recipients
ADMIN_EMAIL=admin@saintlammyfoundation.org
FOUNDATION_EMAIL=info@saintlammyfoundation.org

# Site URL
NEXT_PUBLIC_SITE_URL=https://saintlammyfoundation.org

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Email Templates Included

### 1. Volunteer Confirmation Email
- Professional gradient header
- Application summary
- Next steps timeline
- Contact information

### 2. Admin Notification Email
- New application alert
- Complete applicant details
- Direct link to admin dashboard
- Quick review access

### 3. Approval Email (Future)
- Congratulations message
- Login credentials
- Volunteer portal access
- Orientation steps

## Verification Checklist

- [ ] Email service installed (Resend/SendGrid)
- [ ] API key added to environment variables
- [ ] Admin email configured
- [ ] Foundation email configured
- [ ] Site URL configured
- [ ] Email templates tested
- [ ] Volunteer receives confirmation
- [ ] Admin receives notification
- [ ] No errors in server logs

## Customization

### Update Email Design
Edit templates in `lib/email.ts`:
- Change colors (currently using purple gradient)
- Update logo/branding
- Modify content structure

### Add More Email Types
Create new functions in `lib/email.ts`:
```typescript
export async function sendVolunteerRejectionEmail(data) { ... }
export async function sendVolunteerReminderEmail(data) { ... }
```

## Troubleshooting

**Issue: Emails not sending**
- Check API keys are correct
- Verify environment variables loaded
- Check server logs for errors
- Ensure SMTP service is active

**Issue: Emails go to spam**
- Configure SPF/DKIM records
- Use verified sender domain
- Add unsubscribe links

**Issue: Wrong recipient**
- Verify ADMIN_EMAIL in .env.local
- Check email addresses in code

## Production Deployment

Before deploying to production:

1. ✅ Choose email service (Resend recommended)
2. ✅ Get API key and add to hosting platform env vars
3. ✅ Configure admin email addresses
4. ✅ Test on staging environment
5. ✅ Verify SPF/DKIM records
6. ✅ Monitor email delivery rates

## Cost Estimates

| Service | Free Tier | Paid Plan | Best For |
|---------|-----------|-----------|----------|
| **Resend** | 3,000/month | $20/month (50k) | Modern API, great DX |
| **SendGrid** | 100/day | $15/month (40k) | Established, reliable |
| **Mailgun** | 1,000/month | $35/month (50k) | Enterprise features |

## Next Steps

1. **Choose an email service** - Resend recommended for ease of use
2. **Install the package** - `npm install resend`
3. **Get API key** - Sign up at https://resend.com
4. **Update lib/email.ts** - Replace TODO sections with actual implementation
5. **Add env variables** - Configure .env.local
6. **Test locally** - Submit volunteer form and verify emails
7. **Deploy to production** - Add env vars to hosting platform

## Questions?

For issues or questions about email setup, check:
- Resend docs: https://resend.com/docs
- SendGrid docs: https://docs.sendgrid.com/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

---

**Last Updated:** March 2, 2026
**Status:** Email infrastructure ready, SMTP configuration pending
