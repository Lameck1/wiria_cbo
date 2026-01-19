import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://wiriacbo.org';

// Define routes manually to avoid TS compilation issues in this script
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/programs', priority: '0.9', changefreq: 'weekly' },
  { path: '/resources', priority: '0.8', changefreq: 'weekly' },
  { path: '/opportunities', priority: '0.8', changefreq: 'weekly' },
  { path: '/careers', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/membership', priority: '0.7', changefreq: 'monthly' },
  { path: '/donations', priority: '0.7', changefreq: 'monthly' },
  { path: '/safeguarding', priority: '0.6', changefreq: 'monthly' },
  { path: '/member-login', priority: '0.5', changefreq: 'monthly' },
  { path: '/staff-login', priority: '0.4', changefreq: 'monthly' },
];

const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((route) => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap generated at ${sitemapPath}`);
};

generateSitemap();
