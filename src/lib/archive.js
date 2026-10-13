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

export function monthKeyFromDay(dayKey) {
  return String(dayKey || '').slice(0, 7);
}

export function monthTitle(ym) {
  const [y, m] = String(ym || '')
    .split('-')
    .map(Number);
  if (!y || !m) return String(ym || '');
  const label = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, 1)));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Regroupe les editions [jour, items] par mois YYYY-MM, plus recent d'abord. */
export function groupEditionsByMonth(editions = []) {
  const map = new Map();
  for (const row of editions) {
    const mk = monthKeyFromDay(row[0]);
    if (!mk) continue;
    if (!map.has(mk)) map.set(mk, []);
    map.get(mk).push(row);
  }
  return [...map.entries()];
}

/** Aujourd'hui Paris en YYYY-MM-DD. */
export function parisTodayKey(now = new Date()) {
  return parisDayKey(now);
}

/**
 * Regroupe des objets avec un champ date (YYYY-MM-DD ou Date) par mois.
 * Ordre des mois : plus recent d'abord. Ordre interne conserve celui de `items`.
 */
export function groupItemsByMonth(items = [], getDate = (item) => item.date) {
  const map = new Map();
  for (const item of items) {
    const raw = getDate(item);
    const day = raw instanceof Date ? parisDayKey(raw) : String(raw || '').slice(0, 10);
    const mk = monthKeyFromDay(day);
    if (!mk) continue;
    if (!map.has(mk)) map.set(mk, []);
    map.get(mk).push(item);
  }
  return [...map.entries()];
}

export function isUpcomingDate(date, today = parisTodayKey()) {
  return String(date || '') >= today;
}

export function isUpcomingCombat(fight, today = parisTodayKey()) {
  return fight?.status === 'a-venir' && isUpcomingDate(fight.date, today);
}

export function isResultCombat(fight) {
  return fight?.status === 'dispute';
}
