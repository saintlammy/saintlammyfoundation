// SEO utilities for dynamic meta tags and structured data

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  canonical?: string;
  noindex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: "Saintlammy Foundation - Empowering Widows, Orphans & Vulnerable Communities in Nigeria",
  description: "Hope Has a Home. Join Saintlammy Foundation in building a future where no widow is forgotten, no orphan left behind. Supporting vulnerable communities across Nigeria with love, structure, and action.",
  keywords: "Nigeria charity, orphan care, widow empowerment, community development, charitable foundation, nonprofit organization, vulnerable families, social impact",
  image: "https://saintlammyfoundation.org/og-image.jpg",
  url: "https://saintlammyfoundation.org",
  type: "website",
  author: "Saintlammy Foundation"
};

// Generate page-specific SEO config
export const generateSEO = (pageConfig: Partial<SEOConfig>): SEOConfig => {
  const config = { ...defaultSEO, ...pageConfig };

  // Ensure title includes foundation name if not present
  if (!config.title.includes('Saintlammy Foundation')) {
    config.title = `${config.title} - Saintlammy Foundation`;
  }

  return config;
};

// Pre-defined SEO configs for main pages
export const pageSEO = {
  home: generateSEO({
    title: "Saintlammy Foundation - Hope Has a Home",
    description: "Empowering widows, orphans, and vulnerable communities across Nigeria. Join us in building a future where no one is left behind through love, structure, and action.",
    url: "https://saintlammyfoundation.org",
  }),

  about: generateSEO({
    title: "About Us - Building Hope in Nigeria",
    description: "Learn about Saintlammy Foundation's mission to empower widows, orphans, and vulnerable families across Nigeria. Discover our story, vision, and commitment to community transformation.",
    url: "https://saintlammyfoundation.org/about",
    keywords: "about saintlammy foundation, Nigeria charity mission, orphan care vision, widow empowerment story"
  }),

  programs: generateSEO({
    title: "Our Programs - Orphan Care, Widow Empowerment & Community Development",
    description: "Explore Saintlammy Foundation's comprehensive programs: Orphan Care & Education, Widow Empowerment, Community Development, and Partnership initiatives across Nigeria.",
    url: "https://saintlammyfoundation.org/programs",
    keywords: "orphan care programs, widow empowerment Nigeria, community development, education programs, partnership initiatives"
  }),

  donate: generateSEO({
    title: "Donate - Support Widows, Orphans & Vulnerable Communities",
    description: "Make a difference today. Support Saintlammy Foundation's mission to empower widows, orphans, and vulnerable families across Nigeria. Every donation creates lasting impact.",
    url: "https://saintlammyfoundation.org/donate",
    keywords: "donate Nigeria charity, support orphans, widow empowerment donation, community development funding"
  }),

  volunteer: generateSEO({
    title: "Volunteer - Join Our Mission in Nigeria",
    description: "Become a volunteer with Saintlammy Foundation. Use your skills and passion to make a direct impact on widows, orphans, and vulnerable communities across Nigeria.",
    url: "https://saintlammyfoundation.org/volunteer",
    keywords: "volunteer Nigeria, charity volunteer opportunities, community service Nigeria, nonprofit volunteering"
  }),

  contact: generateSEO({
    title: "Contact Us - Get in Touch",
    description: "Connect with Saintlammy Foundation. Reach out for partnerships, volunteer opportunities, or to learn more about our work with widows, orphans, and vulnerable communities.",
    url: "https://saintlammyfoundation.org/contact",
    keywords: "contact saintlammy foundation, Nigeria charity contact, partnership inquiries, volunteer contact"
  }),

  news: generateSEO({
    title: "News & Updates - Latest from Our Communities",
    description: "Stay updated with the latest news from Saintlammy Foundation. Read about our recent outreaches, success stories, and impact in Nigerian communities.",
    url: "https://saintlammyfoundation.org/news",
    keywords: "saintlammy foundation news, Nigeria charity updates, community impact stories, outreach programs"
  }),

  stories: generateSEO({
    title: "Success Stories - Lives Transformed",
    description: "Read inspiring success stories from widows, orphans, and communities transformed by Saintlammy Foundation's programs across Nigeria.",
    url: "https://saintlammyfoundation.org/stories",
    keywords: "success stories, impact stories, testimonials, beneficiary stories, community transformation"
  }),

  gallery: generateSEO({
    title: "Gallery - Our Impact in Pictures",
    description: "Explore photos and stories from Saintlammy Foundation's outreach programs, community events, and impact across Nigeria.",
    url: "https://saintlammyfoundation.org/gallery",
    keywords: "photo gallery, outreach photos, community events, impact pictures, Nigeria charity gallery"
  }),

  outreaches: generateSEO({
    title: "Outreach Programs - Community Impact Initiatives",
    description: "Discover Saintlammy Foundation's outreach programs bringing hope, education, healthcare, and support to communities across Nigeria.",
    url: "https://saintlammyfoundation.org/outreaches",
    keywords: "outreach programs, community outreach, Nigeria charity programs, humanitarian aid, community support"
  }),

  governance: generateSEO({
    title: "Governance - Leadership & Accountability",
    description: "Learn about Saintlammy Foundation's governance structure, board of directors, and commitment to transparency and accountability.",
    url: "https://saintlammyfoundation.org/governance",
    keywords: "nonprofit governance, board of directors, leadership, organizational structure, accountability"
  }),

  transparency: generateSEO({
    title: "Transparency - Financial Reports & Impact Data",
    description: "View Saintlammy Foundation's financial reports, impact metrics, and commitment to transparent operations serving Nigerian communities.",
    url: "https://saintlammyfoundation.org/transparency",
    keywords: "transparency, financial reports, annual reports, impact metrics, nonprofit accountability"
  }),

  beneficiaries: generateSEO({
    title: "Beneficiaries - Lives We've Touched",
    description: "Meet the widows, orphans, and families whose lives have been transformed through Saintlammy Foundation's programs across Nigeria.",
    url: "https://saintlammyfoundation.org/beneficiaries",
    keywords: "beneficiaries, program recipients, impact stories, community members, lives transformed"
  }),

  partner: generateSEO({
    title: "Partner With Us - Strategic Partnerships",
    description: "Partner with Saintlammy Foundation to amplify impact. Explore corporate partnerships, foundation collaborations, and strategic alliances.",
    url: "https://saintlammyfoundation.org/partner",
    keywords: "partnership opportunities, corporate partnerships, nonprofit collaboration, strategic alliances, CSR partnerships"
  }),

  sponsor: generateSEO({
    title: "Sponsor a Child or Family - Make a Lasting Impact",
    description: "Sponsor a child's education or support a widow's family. Create lasting change through direct sponsorship with Saintlammy Foundation.",
    url: "https://saintlammyfoundation.org/sponsor",
    keywords: "child sponsorship, family sponsorship, orphan support, widow empowerment, direct giving"
  }),

  partnershipTeam: generateSEO({
    title: "Partnership Team - Our Collaborative Network",
    description: "Meet our partnership team and learn about Saintlammy Foundation's collaborative approach to community development across Nigeria.",
    url: "https://saintlammyfoundation.org/partnership-team",
    keywords: "partnership team, collaboration, nonprofit partners, community partnerships, strategic alliances"
  }),

  privacy: generateSEO({
    title: "Privacy Policy - Data Protection & Privacy",
    description: "Saintlammy Foundation's privacy policy detailing how we collect, use, and protect your personal information.",
    url: "https://saintlammyfoundation.org/privacy",
    keywords: "privacy policy, data protection, personal information, GDPR, privacy rights",
    noindex: false
  }),

  terms: generateSEO({
    title: "Terms of Service - Website Terms & Conditions",
    description: "Read Saintlammy Foundation's terms of service governing the use of our website and donation platform.",
    url: "https://saintlammyfoundation.org/terms",
    keywords: "terms of service, terms and conditions, website terms, legal terms, user agreement",
    noindex: false
  }),

  cookiePolicy: generateSEO({
    title: "Cookie Policy - How We Use Cookies",
    description: "Learn about Saintlammy Foundation's cookie policy and how we use cookies to improve your browsing experience.",
    url: "https://saintlammyfoundation.org/cookie-policy",
    keywords: "cookie policy, cookies, website cookies, privacy, tracking",
    noindex: false
  }),

  // Individual Program Pages
  orphanAdoption: generateSEO({
    title: "Orphan Care & Adoption Support - Providing Family & Hope",
    description: "Supporting orphans with education, healthcare, family placement, and long-term care. Building futures for vulnerable children across Nigeria.",
    url: "https://saintlammyfoundation.org/programs/orphan-adoption",
    keywords: "orphan care, adoption support, child welfare, orphanages, foster care, family placement Nigeria"
  }),

  widowEmpowerment: generateSEO({
    title: "Widow Empowerment Program - Economic Independence & Support",
    description: "Empowering widows through skills training, microfinance, business support, and community resources. Building economic independence across Nigeria.",
    url: "https://saintlammyfoundation.org/programs/widow-empowerment",
    keywords: "widow empowerment, skills training, microfinance, women empowerment, economic independence Nigeria"
  }),

  educationalExcellence: generateSEO({
    title: "Educational Excellence Program - Quality Education Access",
    description: "Providing scholarships, school supplies, tutoring, and educational resources to vulnerable children. Investing in Nigeria's future through education.",
    url: "https://saintlammyfoundation.org/programs/educational-excellence",
    keywords: "education programs, scholarships, school supplies, tutoring, educational access Nigeria"
  }),

  healthcareAccess: generateSEO({
    title: "Healthcare Access Program - Medical Support & Wellness",
    description: "Delivering healthcare services, medical camps, health education, and wellness support to underserved communities across Nigeria.",
    url: "https://saintlammyfoundation.org/programs/healthcare-access",
    keywords: "healthcare access, medical support, health camps, community health, medical assistance Nigeria"
  })
};

// Generate structured data for different content types
export const generateStructuredData = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Saintlammy Foundation",
    "legalName": "Saintlammy Community Care Initiative",
    "alternateName": "Saintlammy Community Care Initiative",
    "url": "https://saintlammyfoundation.org",
    "logo": "https://saintlammyfoundation.org/logo.png",
    "description": "A Nigerian charitable foundation empowering widows, orphans, and vulnerable communities through love, structure, and action.",
    "foundingDate": "2021",
    "incorporationDate": "2025-11-21",
    "taxID": "33715150-0001",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "CAC Registration Number",
      "value": "9015713"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "nonprofitStatus": "Nonprofit501c3",
    "mission": "Building a future where no widow is forgotten, no orphan left behind, and no vulnerable home stands alone.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+234-XXX-XXX-XXXX",
      "contactType": "customer service",
      "email": "info@saintlammyfoundation.org"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressCountry": "Nigeria"
    },
    "sameAs": [
      "https://facebook.com/saintlammyfoundation",
      "https://twitter.com/saintlammyfnd",
      "https://instagram.com/saintlammyfoundation"
    ]
  }),

  article: (title: string, description: string, publishedTime: string, author: string = "Saintlammy Foundation") => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": "https://saintlammyfoundation.org/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Saintlammy Foundation",
      "logo": {
        "@type": "ImageObject",
        "url": "https://saintlammyfoundation.org/logo.png"
      }
    },
    "datePublished": publishedTime,
    "dateModified": publishedTime
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};

// Helper to generate canonical URL
export const getCanonicalUrl = (path: string = ""): string => {
  const baseUrl = "https://saintlammyfoundation.org";
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Helper to generate Open Graph image URL
export const getOGImageUrl = (title?: string): string => {
  if (!title) return "https://saintlammyfoundation.org/og-image.jpg";

  // In the future, you could generate dynamic OG images
  const encodedTitle = encodeURIComponent(title);
  return `https://saintlammyfoundation.org/api/og?title=${encodedTitle}`;
};