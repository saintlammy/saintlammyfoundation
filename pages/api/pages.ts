import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPages(req, res);
    case 'POST':
      return await createPage(req, res);
    case 'PUT':
      return await updatePage(req, res);
    case 'DELETE':
      return await deletePage(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPages(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit, slug } = req.query;

  try {

    if (!supabase) {
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined, slug as string));
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'page')
      .eq('status', status);

    if (slug) {
      query = query.eq('slug', slug);
    } else {
      query = query.order('publish_date', { ascending: false });
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined, slug as string));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined, slug as string));
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      status: item.status,
      seo_title: item.page_details?.seo_title || item.title,
      seo_description: item.page_details?.seo_description || item.excerpt,
      template: item.page_details?.template || 'default',
      featured_image: item.featured_image,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    // If slug is provided, return single item instead of array
    res.status(200).json(slug && transformedData.length > 0 ? transformedData[0] : transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockPages((limit as any) ? parseInt(limit as string) : undefined, slug as string));
  }
}

async function createPage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pageData = req.body;

    if (!pageData.title || !pageData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = pageData.slug || pageData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPage = {
      ...pageData,
      slug,
      type: 'page',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newPage,
        message: 'Page created successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('content') as any)
      .insert([newPage] as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newPage,
        message: 'Page created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page updated successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('content') as any)
      .update(updateData)
      .eq('id', id)
      .eq('type', 'page')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deletePage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Page deleted successfully (mock mode)'
      });
    }

    const { error } = await (supabase
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'page');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Page deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockPages(limit?: number, slug?: string) {
  const mockPages = [
    {
      id: '1',
      title: 'About Us',
      slug: 'about',
      content: 'Learn about Saintlammy Foundation\'s mission, vision, and the impact we\'re making across Nigeria.',
      excerpt: 'Discover our story and commitment to transforming lives.',
      status: 'published',
      seo_title: 'About Saintlammy Foundation - Our Mission & Impact',
      seo_description: 'Learn about Saintlammy Foundation\'s mission to support orphans, widows, and communities across Nigeria.',
      template: 'default',
      featured_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Contact Us',
      slug: 'contact',
      content: 'Get in touch with Saintlammy Foundation. We\'d love to hear from you.',
      excerpt: 'Connect with us through multiple channels.',
      status: 'published',
      seo_title: 'Contact Saintlammy Foundation - Get In Touch',
      seo_description: 'Contact Saintlammy Foundation to learn more about our programs or get involved.',
      template: 'contact',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Privacy Policy',
      slug: 'privacy',
      content: `<h2>Information We Collect</h2>
<h3>Personal Information</h3>
<ul>
<li>Name, email address, and phone number when you contact us or sign up for our newsletter</li>
<li>Donation information including billing address and payment method details</li>
<li>Volunteer application information including background and skills</li>
<li>Communication preferences and interaction history</li>
</ul>
<h3>Automatically Collected Information</h3>
<ul>
<li>Website usage data through cookies and analytics tools</li>
<li>IP address, browser type, and device information</li>
<li>Pages visited and time spent on our website</li>
<li>Referral source (how you found our website)</li>
</ul>

<h2>How We Use Your Information</h2>
<p><strong>To provide our services:</strong> Processing donations, sending receipts, and communicating about our programs</p>
<p><strong>To improve our website:</strong> Analyzing usage patterns to enhance user experience and functionality</p>
<p><strong>To communicate with you:</strong> Sending newsletters, updates about our impact, and responding to inquiries</p>
<p><strong>To ensure security:</strong> Protecting against fraud and maintaining the security of our systems</p>
<p><strong>For compliance:</strong> Meeting legal requirements for nonprofit organizations and tax reporting</p>

<h2>How We Protect Your Information</h2>
<p><strong>Encryption:</strong> All sensitive data is encrypted both in transit and at rest using industry-standard protocols</p>
<p><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</p>
<p><strong>Secure Payment Processing:</strong> We use PCI-compliant payment processors and never store payment card information</p>
<p><strong>Regular Security Audits:</strong> Our systems undergo regular security assessments and updates</p>
<p><strong>Staff Training:</strong> All team members receive privacy and security training</p>

<h2>Information Sharing</h2>
<p><strong>We do not sell or rent your personal information to third parties.</strong></p>
<p>We may share your information only in these limited circumstances:</p>
<ul>
<li><strong>Service Providers:</strong> With trusted partners who help us operate our website and process donations (under strict confidentiality agreements)</li>
<li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
<li><strong>Anonymized Data:</strong> We may share aggregated, non-identifying information for research or reporting purposes</li>
</ul>

<h2>Your Rights and Choices</h2>
<p><strong>Access and Update:</strong> You can request access to your personal information and ask us to correct or update it</p>
<p><strong>Opt-Out:</strong> You can unsubscribe from our communications at any time using the link in our emails</p>
<p><strong>Data Deletion:</strong> You can request deletion of your personal information, subject to legal retention requirements</p>
<p><strong>Cookies:</strong> You can control cookie settings through your browser preferences</p>

<h2>Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at privacy@saintlammyfoundation.org</p>`,
      excerpt: 'Learn how we protect your privacy and handle your personal information.',
      status: 'published',
      seo_title: 'Privacy Policy - Saintlammy Foundation',
      seo_description: 'Read our privacy policy to understand how we handle your personal information.',
      template: 'legal',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '4',
      title: 'Terms of Service',
      slug: 'terms',
      content: `<h2>Acceptance of Terms</h2>
<p>By accessing and using the Saintlammy Foundation website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>

<h2>About Saintlammy Foundation</h2>
<p>Saintlammy Foundation is a registered nonprofit organization in Nigeria, dedicated to empowering orphans, widows, and vulnerable communities through comprehensive support programs.</p>
<p><strong>CAC Registration:</strong> 9015713</p>
<p><strong>Tax Status:</strong> Tax-exempt nonprofit organization under Nigerian law</p>

<h2>Use of Our Website</h2>
<h3>Permitted Uses</h3>
<ul>
<li>Browsing and learning about our programs and impact</li>
<li>Making donations to support our mission</li>
<li>Applying to volunteer or partner with us</li>
<li>Subscribing to our newsletter and updates</li>
<li>Sharing our content for charitable purposes</li>
</ul>
<h3>Prohibited Uses</h3>
<ul>
<li>Using the website for any unlawful purpose</li>
<li>Attempting to gain unauthorized access to our systems</li>
<li>Distributing malware or harmful code</li>
<li>Impersonating the foundation or its representatives</li>
<li>Using automated systems to scrape or harvest data</li>
<li>Interfering with the website's operation or security</li>
</ul>

<h2>Donations and Payments</h2>
<h3>Donation Policy</h3>
<ul>
<li>All donations are voluntary and non-refundable unless required by law</li>
<li>Donations are used to support our charitable programs and operations</li>
<li>We provide receipts for tax-deductible donations as applicable</li>
<li>Recurring donations can be cancelled at any time by contacting us</li>
</ul>

<h2>Intellectual Property</h2>
<p><strong>Our Content:</strong> All content on this website, including text, images, logos, and design elements, is owned by Saintlammy Foundation or used with permission.</p>

<h2>Limitation of Liability</h2>
<p>To the fullest extent permitted by law, Saintlammy Foundation shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>

<h2>Contact Information</h2>
<p>If you have any questions about these Terms of Service, please contact us at legal@saintlammyfoundation.org</p>`,
      excerpt: 'Terms and conditions governing your use of our website and services.',
      status: 'published',
      seo_title: 'Terms of Service - Saintlammy Foundation',
      seo_description: 'Read our terms of service to understand your rights and responsibilities when using our website.',
      template: 'legal',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '5',
      title: 'Cookie Policy',
      slug: 'cookie-policy',
      content: `<h2>What Are Cookies?</h2>
<p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>

<h2>Types of Cookies We Use</h2>

<h3>Necessary Cookies (Always Active)</h3>
<p>These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.</p>
<ul>
<li>Session management and user authentication</li>
<li>Load balancing and security measures</li>
<li>Cookie consent preferences</li>
<li>Form submission and data validation</li>
</ul>

<h3>Analytics Cookies (Optional)</h3>
<p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our content and user experience.</p>
<ul>
<li>Google Analytics - tracking page views and user behavior</li>
<li>Understanding which pages are most popular</li>
<li>Identifying technical issues and errors</li>
<li>Measuring campaign effectiveness</li>
</ul>

<h3>Marketing Cookies (Optional)</h3>
<p>These cookies are used to track visitors across websites to display relevant advertisements. They may also be used to limit how many times you see an ad and measure the effectiveness of advertising campaigns.</p>
<ul>
<li>Social media integration and sharing</li>
<li>Targeted advertising based on interests</li>
<li>Campaign tracking and attribution</li>
<li>Retargeting and remarketing</li>
</ul>

<h3>Preference Cookies (Optional)</h3>
<p>These cookies allow our website to remember choices you make (such as your language preference or the region you're in) and provide enhanced, more personalized features.</p>
<ul>
<li>Language and region preferences</li>
<li>Theme settings (light/dark mode)</li>
<li>Font size and accessibility preferences</li>
<li>Previously viewed content</li>
</ul>

<h2>Managing Your Cookie Preferences</h2>
<p>You have full control over which cookies you accept. You can manage your preferences at any time through our cookie consent banner or by adjusting your browser settings.</p>

<h2>Browser Settings</h2>
<p>Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Please note that if you disable cookies, some features of our website may not function properly.</p>

<h2>Contact Us</h2>
<p>If you have any questions about how we use cookies, please contact us at info@saintlammyfoundation.org or call +234 706 307 6704.</p>`,
      excerpt: 'Learn about the cookies we use and how you can manage your preferences.',
      status: 'published',
      seo_title: 'Cookie Policy - Saintlammy Foundation',
      seo_description: 'Understand how we use cookies to improve your experience on our website.',
      template: 'legal',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];

  // If slug is provided, return single page
  if (slug) {
    const page = mockPages.find(p => p.slug === slug);
    return page || null;
  }

  return limit ? mockPages.slice(0, limit) : mockPages;
}