/**
 * Batch script to add SEOHead imports and usage to multiple pages
 * This script will be manually reviewed before execution
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../pages');

// Pages to update with their SEO config keys
const pagesToUpdate = [
  { file: 'volunteer.tsx', seoKey: 'volunteer' },
  { file: 'donate.tsx', seoKey: 'donate' },
  { file: 'stories.tsx', seoKey: 'stories' },
  { file: 'gallery.tsx', seoKey: 'gallery' },
  { file: 'news.tsx', seoKey: 'news' },
  { file: 'outreaches.tsx', seoKey: 'outreaches' },
  { file: 'governance.tsx', seoKey: 'governance' },
  { file: 'transparency.tsx', seoKey: 'transparency' },
  { file: 'beneficiaries.tsx', seoKey: 'beneficiaries' },
  { file: 'partner.tsx', seoKey: 'partner' },
  { file: 'sponsor.tsx', seoKey: 'sponsor' },
  { file: 'partnership-team.tsx', seoKey: 'partnershipTeam' },
  { file: 'privacy.tsx', seoKey: 'privacy' },
  { file: 'terms.tsx', seoKey: 'terms' },
  { file: 'cookie-policy.tsx', seoKey: 'cookiePolicy' },
  { file: 'programs/orphan-adoption.tsx', seoKey: 'orphanAdoption' },
  { file: 'programs/widow-empowerment.tsx', seoKey: 'widowEmpowerment' },
  { file: 'programs/educational-excellence.tsx', seoKey: 'educationalExcellence' },
  { file: 'programs/healthcare-access.tsx', seoKey: 'healthcareAccess' }
];

function addSEOToFile(filePath, seoKey) {
  const fullPath = path.join(pagesDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if already has SEOHead
  if (content.includes('import SEOHead')) {
    console.log(`⏭️  Already has SEOHead: ${filePath}`);
    return false;
  }

  // Add imports after existing imports
  const importRegex = /(import.*?from.*?;)\n(?!import)/s;
  const lastImportMatch = content.match(/import.*?from.*?;(?=\n[^i])/s);

  if (lastImportMatch) {
    const insertPos = lastImportMatch.index + lastImportMatch[0].length;
    const seoImports = `\nimport SEOHead from '@/components/SEOHead';\nimport { pageSEO } from '@/lib/seo';`;
    content = content.slice(0, insertPos) + seoImports + content.slice(insertPos);
  }

  // Replace <Head> tag with SEOHead
  const headRegex = /<Head>[\s\S]*?<\/Head>/;
  const replacement = `<SEOHead config={pageSEO.${seoKey}} />`;
  content = content.replace(headRegex, replacement);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated: ${filePath} with pageSEO.${seoKey}`);
  return true;
}

console.log('🚀 Starting batch SEO update...\n');

let updated = 0;
let skipped = 0;

pagesToUpdate.forEach(({ file, seoKey }) => {
  if (addSEOToFile(file, seoKey)) {
    updated++;
  } else {
    skipped++;
  }
});

console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
