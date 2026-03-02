// Supabase Edge Function for sending volunteer emails
// Deploy with: supabase functions deploy send-volunteer-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VolunteerEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  skills: string;
  experience: string;
  motivation: string;
  commitment: string;
  applicationId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data }: { type: 'confirmation' | 'admin' | 'approval', data: VolunteerEmailData } = await req.json()

    // Get Resend API key from environment
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@saintlammyfoundation.org'
    const FOUNDATION_EMAIL = Deno.env.get('FOUNDATION_EMAIL') || 'info@saintlammyfoundation.org'

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    let emailPayload: any

    if (type === 'confirmation') {
      // Volunteer confirmation email
      emailPayload = {
        from: `Saintlammy Foundation <${FOUNDATION_EMAIL}>`,
        to: data.email,
        subject: 'Thank you for applying to volunteer!',
        html: generateConfirmationEmail(data)
      }
    } else if (type === 'admin') {
      // Admin notification email
      emailPayload = {
        from: `Volunteer System <${FOUNDATION_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New Volunteer Application - ${data.firstName} ${data.lastName}`,
        html: generateAdminEmail(data)
      }
    } else if (type === 'approval') {
      // Approval email
      emailPayload = {
        from: `Saintlammy Foundation <${FOUNDATION_EMAIL}>`,
        to: data.email,
        subject: 'Your volunteer application has been approved!',
        html: generateApprovalEmail(data)
      }
    }

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resendData)}`)
    }

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function generateConfirmationEmail(data: VolunteerEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    .info-box { background: #f0f7ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Applying!</h1>
    </div>
    <div class="content">
      <p>Dear ${data.firstName} ${data.lastName},</p>
      <p>Thank you for your interest in volunteering with Saintlammy Foundation! We have received your application and are excited about the possibility of having you join our team.</p>
      <div class="info-box">
        <strong>What happens next?</strong>
        <ol>
          <li><strong>Application Review</strong> - Our volunteer coordinator will review your application within 5-7 business days</li>
          <li><strong>Background Check</strong> - If applicable, we'll verify your background check authorization</li>
          <li><strong>Interview</strong> - We may schedule a brief interview to discuss your interests and our needs</li>
          <li><strong>Orientation</strong> - Once approved, you'll receive volunteer orientation and training</li>
        </ol>
      </div>
      <p><strong>Your Application Summary:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Location:</strong> ${data.location}</li>
        <li><strong>Interests:</strong> ${data.interests.join(', ')}</li>
        <li><strong>Availability:</strong> ${data.availability}</li>
        <li><strong>Time Commitment:</strong> ${data.commitment}</li>
      </ul>
      <p>We look forward to potentially working with you!</p>
      <p>Best regards,<br><strong>Saintlammy Foundation Team</strong></p>
    </div>
    <div class="footer">
      <p>Saintlammy Foundation | Empowering Communities Across Nigeria</p>
    </div>
  </div>
</body>
</html>
  `
}

function generateAdminEmail(data: VolunteerEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .detail-row { padding: 10px; border-bottom: 1px solid #f0f0f0; }
    .detail-label { font-weight: bold; color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🆕 New Volunteer Application Received</h2>
    </div>
    <div class="content">
      <p>A new volunteer application has been submitted:</p>
      <div class="detail-row"><span class="detail-label">Name:</span> ${data.firstName} ${data.lastName}</div>
      <div class="detail-row"><span class="detail-label">Email:</span> ${data.email}</div>
      <div class="detail-row"><span class="detail-label">Phone:</span> ${data.phone}</div>
      <div class="detail-row"><span class="detail-label">Location:</span> ${data.location}</div>
      <div class="detail-row"><span class="detail-label">Interests:</span> ${data.interests.join(', ')}</div>
      <div class="detail-row"><span class="detail-label">Skills:</span><br>${data.skills}</div>
      <div class="detail-row"><span class="detail-label">Experience:</span><br>${data.experience}</div>
      <div class="detail-row"><span class="detail-label">Motivation:</span><br>${data.motivation}</div>
    </div>
  </div>
</body>
</html>
  `
}

function generateApprovalEmail(data: VolunteerEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .success-box { background: #ecfdf5; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Our Team!</h1>
    </div>
    <div class="content">
      <p>Dear ${data.firstName} ${data.lastName},</p>
      <div class="success-box">
        <h2 style="margin-top: 0; color: #059669;">Congratulations! Your volunteer application has been approved!</h2>
        <p>We are thrilled to welcome you to the Saintlammy Foundation volunteer team.</p>
      </div>
      <p>We're excited to have you on board!</p>
      <p>Best regards,<br><strong>Saintlammy Foundation Team</strong></p>
    </div>
  </div>
</body>
</html>
  `
}
