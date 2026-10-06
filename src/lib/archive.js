import { formatDate, liveArticle, parisDayKey } from '../data/entities.js';

export function editionPath(date) {
  return `/actualites/${parisDayKey(date)}`;
}

export function editionTitle(date) {
  return `Actualité du ${formatDate(date)}`;
}

export function editionMeta(items) {
  const data = items.map((item) => liveArticle(item.data));
  const labels = data.slice(0, 3).map((d) => d.coverVersus?.replace(' / ', ' contre ') || d.h1);
  const more = data.length > 3 ? `, et ${data.length - 3} autre${data.length - 3 > 1 ? 's' : ''}` : '';
  return `${editionTitle(items[0].data.date)} sur Combat Boxe : ${labels.join(' ; ')}${more}.`;
}
