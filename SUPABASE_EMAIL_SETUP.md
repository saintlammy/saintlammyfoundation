# Supabase Email Confirmation Setup

## Quick Configuration Steps

### 1. Update Email Template in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Email Templates**
3. Click on **"Confirm signup"** template
4. Replace the confirmation URL with:

```
{{ .SiteURL }}/admin/confirm#access_token={{ .Token }}&refresh_token={{ .RefreshToken }}&type=signup
```

### 2. Configure Site URLs

1. Go to **Settings > General** in Supabase
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. Add to **Redirect URLs**:
   - Development: `http://localhost:3000/admin/confirm`
   - Production: `https://yourdomain.com/admin/confirm`

### 3. Test the Flow

1. Sign up a new user at `/admin/signup`
2. Check email for confirmation link
3. Click the link - should redirect to `/admin/confirm`
4. Confirm page should set session and redirect to admin dashboard

### 4. Email Template Example

If you want to customize the email template further, here's the full template:

```html
<h2>Confirm your signup for Saintlammy Foundation Admin</h2>

<p>Follow this link to confirm your admin account:</p>
<p><a href="{{ .SiteURL }}/admin/confirm#access_token={{ .Token }}&refresh_token={{ .RefreshToken }}&type=signup">Confirm your admin account</a></p>

<p>This link will expire in 24 hours.</p>
```

## Current Status

✅ Email confirmation page created at `/admin/confirm`
✅ Authentication session handling implemented
✅ Proper redirect to admin dashboard after confirmation
✅ Wallet management authentication issue fixed

## Need to Configure in Supabase Dashboard

❓ Email template redirect URL (requires manual configuration)
❓ Site URL and redirect URLs (requires manual configuration)