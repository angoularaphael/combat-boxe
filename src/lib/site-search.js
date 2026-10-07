import { getCollection } from 'astro:content';
import { boxeurs, clubs, coachs, combats, galas, formatDate, liveArticle } from '../data/entities';

const pages = [
  ['/actualites', 'Page', 'Actualités', 'Fil des papiers de boxe.'],
  ['/combats-a-venir', 'Page', 'Combats à venir', 'Calendrier des combats annoncés.'],
  ['/resultats-boxe', 'Page', 'Résultats', 'Combats déjà disputés.'],
  ['/calendrier-combats-boxe', 'Page', 'Calendrier', 'Dates des combats de boxe.'],
  ['/galas-boxe', 'Page', 'Galas', 'Soirées et cartes.'],
  ['/boxeurs-francais', 'Page', 'Boxeurs français', 'Fiches des boxeurs français.'],
  ['/boxeurs-internationaux', 'Page', 'Boxeurs internationaux', 'Fiches des boxeurs internationaux.'],
  ['/clubs-boxe-france', 'Page', 'Clubs', 'Salles de boxe en France.'],
  ['/entraineurs-boxe-francais', 'Page', 'Entraîneurs', 'Coachs de boxe anglaise.'],
];

function row(href, kind, title, text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return { href, kind, title: String(title || '').trim(), text: clean };
}

export async function siteSearchIndex() {
  const articles = (await getCollection('articles'))
    .filter((item) => item.data.status === 'published')
    .map((item) => liveArticle(item.data));
  const rows = pages.map(([href, kind, title, text]) => row(href, kind, title, text));

  for (const article of articles) {
    rows.push(
      row(
        `/${article.slug}`,
        'Actualité',
        article.h1,
        [article.description, article.coverVersus, article.coverMeta].filter(Boolean).join(' '),
      ),
    );
  }

  for (const fight of combats) {
    const title = `${fight.boxerA} contre ${fight.boxerB}`;
    rows.push(
      row(
        fight.article ? `/${fight.article}` : fight.href,
        fight.status === 'dispute' ? 'Résultat' : 'Combat',
        title,
        [formatDate(fight.date), fight.city, fight.category, fight.titles, fight.stakes, fight.winner, fight.method]
          .filter(Boolean)
          .join('. '),
      ),
    );
  }

  for (const gala of galas) {
    rows.push(row(gala.href, 'Gala', gala.name, [formatDate(gala.date), gala.city, gala.note, gala.versus].filter(Boolean).join('. ')));
  }

  for (const boxeur of boxeurs) {
    rows.push(
      row(
        `/boxeurs/${boxeur.slug}`,
        'Boxeur',
        boxeur.name,
        [boxeur.category, boxeur.ranking, boxeur.recordNote, boxeur.objectif, boxeur.city].filter(Boolean).join('. '),
      ),
    );
  }

  for (const club of clubs) {
    rows.push(row(`/clubs/${club.slug}`, 'Club', club.name, [club.city, club.address, ...(club.disciplines || [])].filter(Boolean).join('. ')));
  }

  for (const coach of coachs) {
    rows.push(row(`/coachs/${coach.slug}`, 'Entraîneur', coach.name, [coach.city, coach.role, ...(coach.diplomes || [])].filter(Boolean).join('. ')));
  }

  const seen = new Set();
  return rows.filter((item) => {
    const key = `${item.href}|${item.title}`;
    if (!item.href || !item.title || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
