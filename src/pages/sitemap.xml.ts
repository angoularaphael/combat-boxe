import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { boxeurs, clubs, coachs, combats, galas, groupArticlesByDay, parisDayKey } from '../data/entities';

export const prerender = true;

function xml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imageLoc(site: string, path?: string) {
  if (!path || path.includes('undefined')) return '';
  const abs = path.startsWith('http') ? path : `${site}${path.startsWith('/') ? path : `/${path}`}`;
  return `<image:image><image:loc>${xml(abs)}</image:loc></image:image>`;
}

export const GET: APIRoute = async () => {
  const site = 'https://combat-boxe.com';
  const buildDate = new Date().toISOString().slice(0, 10);
  const pages = await getCollection('pages');
  const articles = (await getCollection('articles')).filter((a) => a.data.status === 'published');
  const editions = groupArticlesByDay(articles);
  const urls = [
    { loc: site, lastmod: buildDate, image: '/img/og-combat-boxe.jpg' },
    ...pages.map((p) => ({
      loc: `${site}/${p.data.slug}`,
      lastmod: buildDate,
      image: p.data.image,
    })),
    ...editions.map(([jour, items]) => ({
      loc: `${site}/actualites/${jour}`,
      lastmod: parisDayKey(items[0].data.date),
    })),
    ...articles.map((a) => ({
      loc: `${site}/${a.data.slug}`,
      lastmod: a.data.date.toISOString().slice(0, 10),
      image: a.data.image,
    })),
    ...combats.map((c) => ({
      loc: `${site}${c.href}`,
      lastmod: String(c.date || buildDate).slice(0, 10),
    })),
    ...galas.map((g) => ({
      loc: `${site}${g.href}`,
      lastmod: String(g.date || buildDate).slice(0, 10),
    })),
    ...boxeurs.map((b) => ({
      loc: `${site}/boxeurs/${b.slug}`,
      lastmod: buildDate,
      image: b.photo,
    })),
    ...clubs.map((c) => ({
      loc: `${site}/clubs/${c.slug}`,
      lastmod: buildDate,
      image: c.image,
    })),
    ...coachs.filter((c) => c.slug).map((c) => ({
      loc: `${site}/coachs/${c.slug}`,
      lastmod: buildDate,
      image: c.photo,
    })),
  ].filter((u) => (u.loc === site || u.loc.startsWith(`${site}/`)) && !u.loc.includes('undefined'));
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url><loc>${xml(u.loc)}</loc><lastmod>${xml(u.lastmod)}</lastmod>${imageLoc(site, u.image)}</url>`,
  )
  .join('\n')}
</urlset>`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
