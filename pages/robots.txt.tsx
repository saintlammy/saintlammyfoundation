import { GetServerSideProps } from 'next';

const SITE_URL = 'https://saintlammyfoundation.org';

const generateRobotsTxt = () => {
  return `# Robots.txt for Saintlammy Foundation
# https://saintlammyfoundation.org/robots.txt

User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin/
Disallow: /api/

# Disallow temporary and test pages
Disallow: /test/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /
Allow: /about
Allow: /programs
Allow: /donate
Allow: /volunteer
Allow: /contact
Allow: /news
Allow: /beneficiaries

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay (be nice to the server)
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Block common bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = generateRobotsTxt();

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

// This component won't actually render anything
const RobotsTxt = () => null;

export default RobotsTxt;