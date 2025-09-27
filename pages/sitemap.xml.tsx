import { GetServerSideProps } from 'next';

const SITE_URL = 'https://saintlammyfoundation.org';

// Define all static routes
const staticRoutes = [
  '',
  '/about',
  '/programs',
  '/donate',
  '/volunteer',
  '/contact',
  '/news',
  '/beneficiaries',
  '/partnership-team',
  '/outreaches',
  '/partner'
];

// Dynamic routes (news articles, etc.)
const getDynamicRoutes = async () => {
  // In a real implementation, you would fetch these from your CMS/database
  const newsRoutes = [
    '/news/december-medical-outreach-2024',
    '/news/school-partnership-expansion-2024',
    '/news/widow-empowerment-success-2024'
  ];

  return newsRoutes;
};

const generateSitemap = (routes: string[]) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes
  .map((route) => {
    const url = `${SITE_URL}${route}`;
    const lastmod = new Date().toISOString();

    // Set priority based on route importance
    let priority = '0.5';
    if (route === '') priority = '1.0'; // Homepage
    else if (route === '/donate') priority = '0.9'; // Donation page
    else if (route === '/about' || route === '/programs') priority = '0.8'; // Main pages
    else if (route.startsWith('/news/')) priority = '0.6'; // News articles

    // Set change frequency
    let changefreq = 'monthly';
    if (route === '') changefreq = 'weekly'; // Homepage
    else if (route === '/news') changefreq = 'weekly'; // News index
    else if (route.startsWith('/news/')) changefreq = 'yearly'; // Individual articles

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return sitemap;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const dynamicRoutes = await getDynamicRoutes();
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    const sitemap = generateSitemap(allRoutes);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Fallback to static routes only
    const sitemap = generateSitemap(staticRoutes);
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  }
};

// This component won't actually render anything
const Sitemap = () => null;

export default Sitemap;