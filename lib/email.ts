import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@saintlammyfoundation.org';
const FOUNDATION_EMAIL = process.env.FOUNDATION_EMAIL || 'info@saintlammyfoundation.org';

export interface VolunteerEmailData {
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

/**
 * Send email notification when new volunteer application is submitted
 * Using Supabase Edge Functions (Option A - True Supabase Implementation)
 */
export async function sendVolunteerApplicationEmails(data: VolunteerEmailData) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase not configured - emails logged to console only');
    await sendVolunteerConfirmationEmail(data);
    await sendAdminNotificationEmail(data);
    return { success: true, mode: 'console-only' };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send confirmation email to volunteer via Supabase Edge Function
    const { data: confirmationResult, error: confirmationError } = await supabase.functions.invoke(
      'send-volunteer-email',
      {
        body: {
          type: 'confirmation',
          data
        }
      }
    );

    if (confirmationError) {
      console.error('Error sending confirmation email:', confirmationError);
    } else {
      console.log('✅ Confirmation email sent to volunteer:', data.email);
    }

    // Send notification email to admin via Supabase Edge Function
    const { data: adminResult, error: adminError } = await supabase.functions.invoke(
      'send-volunteer-email',
      {
        body: {
          type: 'admin',
          data
        }
      }
    );

    if (adminError) {
      console.error('Error sending admin notification:', adminError);
    } else {
      console.log('✅ Admin notification email sent');
    }

    return { success: true, mode: 'edge-function' };
  } catch (error) {
    console.error('Error sending volunteer emails via Edge Function:', error);
    // Fallback to console logging
    console.log('📧 Falling back to console logging...');
    await sendVolunteerConfirmationEmail(data);
    await sendAdminNotificationEmail(data);
    return { success: false, error, mode: 'fallback-console' };
  }
}

/**
 * Send confirmation email to volunteer applicant
 */
async function sendVolunteerConfirmationEmail(data: VolunteerEmailData) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not configured for email');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const emailHtml = `
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
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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

      <p>If you have any questions in the meantime, please don't hesitate to contact us at <a href="mailto:${FOUNDATION_EMAIL}">${FOUNDATION_EMAIL}</a>.</p>

      <p>We look forward to potentially working with you to make a difference in the lives of widows, orphans, and vulnerable communities across Nigeria!</p>

      <p>Best regards,<br>
      <strong>Saintlammy Foundation Team</strong></p>
    </div>
    <div class="footer">
      <p>Saintlammy Foundation | Empowering Communities Across Nigeria</p>
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
  `;

  // Use Supabase Auth to send email
  // Note: This requires Supabase email templates to be configured
  // For now, we'll log it. You'll need to configure Supabase SMTP settings
  console.log('📧 Volunteer confirmation email prepared for:', data.email);
  console.log('Email content length:', emailHtml.length);

  // TODO: Implement actual email sending via Supabase or external service
  // Supabase doesn't have a direct email sending API for custom emails
  // You'll need to use Supabase Edge Functions or integrate with SendGrid/Resend

  return { success: true, message: 'Email logged (SMTP configuration needed)' };
}

/**
 * Send notification email to admin about new volunteer application
 */
async function sendAdminNotificationEmail(data: VolunteerEmailData) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not configured for email');
    return;
  }

  const emailHtml = `
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
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🆕 New Volunteer Application Received</h2>
    </div>
    <div class="content">
      <p>A new volunteer application has been submitted. Please review the details below:</p>

      <div class="detail-row">
        <span class="detail-label">Name:</span> ${data.firstName} ${data.lastName}
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span> ${data.phone}
      </div>
      <div class="detail-row">
        <span class="detail-label">Location:</span> ${data.location}
      </div>
      <div class="detail-row">
        <span class="detail-label">Interests:</span> ${data.interests.join(', ')}
      </div>
      <div class="detail-row">
        <span class="detail-label">Availability:</span> ${data.availability}
      </div>
      <div class="detail-row">
        <span class="detail-label">Time Commitment:</span> ${data.commitment}
      </div>
      <div class="detail-row">
        <span class="detail-label">Skills:</span><br>${data.skills}
      </div>
      <div class="detail-row">
        <span class="detail-label">Experience:</span><br>${data.experience}
      </div>
      <div class="detail-row">
        <span class="detail-label">Motivation:</span><br>${data.motivation}
      </div>

      ${data.applicationId ? `<p><strong>Application ID:</strong> ${data.applicationId}</p>` : ''}

      <p style="margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://saintlammyfoundation.org'}/admin/content/volunteers" class="button">
          Review in Dashboard
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  console.log('📧 Admin notification email prepared for:', ADMIN_EMAIL);
  console.log('Email content length:', emailHtml.length);

  // TODO: Implement actual email sending
  return { success: true, message: 'Email logged (SMTP configuration needed)' };
}

/**
 * Send approval email to volunteer
 */
export async function sendVolunteerApprovalEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  loginUrl?: string;
  temporaryPassword?: string;
}) {
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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

      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Check your email for login credentials (if not already provided)</li>
        <li>Access your volunteer dashboard to view assignments</li>
        <li>Complete any required orientation modules</li>
        <li>Start making a difference in your community!</li>
      </ol>

      ${data.loginUrl ? `
        <p style="text-align: center;">
          <a href="${data.loginUrl}" class="button">Access Volunteer Portal</a>
        </p>
      ` : ''}

      <p>If you have any questions, please contact us at <a href="mailto:${FOUNDATION_EMAIL}">${FOUNDATION_EMAIL}</a>.</p>

      <p>We're excited to have you on board!</p>

      <p>Best regards,<br>
      <strong>Saintlammy Foundation Team</strong></p>
    </div>
    <div class="footer">
      <p>Saintlammy Foundation | Empowering Communities Across Nigeria</p>
    </div>
  </div>
</body>
</html>
  `;

  console.log('📧 Volunteer approval email prepared for:', data.email);

  return { success: true, message: 'Email logged (SMTP configuration needed)' };
}
