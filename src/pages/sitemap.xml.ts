import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { boxeurs, clubs, coachs } from '../data/entities';

export const GET: APIRoute = async () => {
  const site = 'https://combat-boxe.com';
  const buildDate = new Date().toISOString().slice(0, 10);
  const pages = await getCollection('pages');
  const articles = (await getCollection('articles')).filter((a) => a.data.status === 'published');
  const urls = [
    { loc: site, lastmod: buildDate, image: `${site}/img/og-combat-boxe.jpg` },
    ...pages.map((p) => ({
      loc: `${site}/${p.data.slug}`,
      lastmod: buildDate,
      image: p.data.image ? `${site}${p.data.image}` : undefined,
    })),
    ...articles.map((a) => ({
      loc: `${site}/${a.data.slug}`,
      lastmod: a.data.date.toISOString().slice(0, 10),
      image: `${site}${a.data.image}`,
    })),
    ...boxeurs.map((b) => ({
      loc: `${site}/boxeurs/${b.slug}`,
      lastmod: buildDate,
      image: `${site}${b.photo}`,
    })),
    ...clubs.map((c) => ({
      loc: `${site}/clubs/${c.slug}`,
      lastmod: buildDate,
      image: `${site}${c.image}`,
    })),
    ...coachs.map((c) => ({
      loc: `${site}/coachs/${c.slug}`,
      lastmod: buildDate,
      image: `${site}${c.photo}`,
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod>${u.image ? `<image:image><image:loc>${u.image}</image:loc></image:image>` : ''}</url>`,
  )
  .join('\n')}
</urlset>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
