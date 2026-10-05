import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { boxeurs, clubs, coachs } from '../data/entities';

export const GET: APIRoute = async () => {
  const site = 'https://combat-boxe.com';
  const pages = await getCollection('pages');
  const articles = (await getCollection('articles')).filter((a) => a.data.status === 'published');
  const urls = [
    { loc: site, lastmod: '2026-10-05' },
    ...pages.map((p) => ({ loc: `${site}/${p.data.slug}`, lastmod: '2026-10-05' })),
    ...articles.map((a) => ({
      loc: `${site}/${a.data.slug}`,
      lastmod: a.data.date.toISOString().slice(0, 10),
    })),
    ...boxeurs.map((b) => ({ loc: `${site}/boxeurs/${b.slug}`, lastmod: '2026-10-05' })),
    ...clubs.map((c) => ({ loc: `${site}/clubs/${c.slug}`, lastmod: '2026-10-05' })),
    ...coachs.map((c) => ({ loc: `${site}/coachs/${c.slug}`, lastmod: '2026-10-05' })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`,
  )
  .join('\n')}
</urlset>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
