import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourcePath = process.argv[2];
const outputPath = path.join(
  projectRoot,
  'public/images/outreaches/q2-widows-relief-2026-og.jpg'
);

if (!sourcePath) {
  throw new Error('Pass the generated outreach background image as the first argument.');
}

const [boldFont, mediumFont, logoSource] = await Promise.all([
  fs.readFile(path.join(projectRoot, 'public/fonts/Type Dynamic - Sailec Bold.otf')),
  fs.readFile(path.join(projectRoot, 'public/fonts/Type Dynamic - Sailec Medium.otf')),
  fs.readFile(path.join(projectRoot, 'public/images/logo/logo-icon.svg'), 'utf8')
]);

const whiteLogo = logoSource
  .replace(/width="512" height="198"/, 'width="120" height="46"')
  .replaceAll('fill="black"', 'fill="#F7F3E8"');

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const boldFontData = boldFont.toString('base64');
const mediumFontData = mediumFont.toString('base64');
const overlay = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <style>
      @font-face {
        font-family: 'Sailec';
        src: url(data:font/otf;base64,${mediumFontData}) format('opentype');
        font-weight: 500;
      }
      @font-face {
        font-family: 'Sailec';
        src: url(data:font/otf;base64,${boldFontData}) format('opentype');
        font-weight: 700;
      }
      .medium { font-family: 'Sailec', 'Helvetica Neue', sans-serif; font-weight: 500; }
      .bold { font-family: 'Sailec', 'Helvetica Neue', sans-serif; font-weight: 700; }
    </style>
    <g transform="translate(56 48)">${whiteLogo}</g>
    <text x="194" y="72" class="bold" fill="#F7F3E8" font-size="20" letter-spacing="1.7">SAINTLAMMY</text>
    <text x="194" y="98" class="medium" fill="#BFE8D5" font-size="17" letter-spacing="2.5">FOUNDATION</text>

    <text x="58" y="172" class="bold" fill="#78E0AC" font-size="17" letter-spacing="2.4">PAST OUTREACH &amp; IMPACT</text>
    <text x="58" y="256" class="bold" fill="#FFFDF7" font-size="57">${escapeXml('Restoring dignity.')}</text>
    <text x="58" y="322" class="bold" fill="#FFFDF7" font-size="57">${escapeXml('Supporting families.')}</text>

    <line x1="58" y1="374" x2="482" y2="374" stroke="#78E0AC" stroke-width="2" opacity="0.9" />
    <text x="58" y="420" class="bold" fill="#FFFDF7" font-size="27" letter-spacing="0.7">71 WIDOWS REACHED</text>
    <text x="58" y="459" class="medium" fill="#D7EEE2" font-size="19" letter-spacing="1.2">LAGOS, NIGERIA  ·  25 JULY 2026</text>

    <rect x="58" y="530" width="316" height="42" rx="21" fill="#F7F3E8" />
    <text x="80" y="558" class="bold" fill="#075C41" font-size="15" letter-spacing="1.8">Q2 WIDOWS RELIEF  ·  2026</text>
  </svg>`;

await fs.mkdir(path.dirname(outputPath), { recursive: true });

await sharp(sourcePath)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 86, progressive: true, chromaSubsampling: '4:2:0' })
  .toFile(outputPath);

console.log(outputPath);
