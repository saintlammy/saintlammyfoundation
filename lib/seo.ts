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