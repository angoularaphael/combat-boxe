import credits from '../data/photo-credits.json';
import POSTERS from '../data/posters.json';
import { namesFromHeadline } from './headline-names.js';

function norm(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const local = [{ keys: ['valentin guth', 'guth'], path: '/img/valentin-guth-hero.jpg' }];

const SCENES = [
  '/img/scene-ropes.jpg',
  '/img/scene-corner.jpg',
  '/img/scene-glove.jpg',
  '/img/scene-canvas.jpg',
  '/img/scene-speedbag.jpg',
  '/img/scene-belt.jpg',
];

export { namesFromHeadline } from './headline-names.js';

export function portraitFor(name) {
  if (!name) return '';
  const n = norm(name);
  const localHit = local.find((row) => row.keys.some((k) => n === norm(k) || n.endsWith(' ' + norm(k))));
  if (localHit) return localHit.path;
  const row = credits.find((item) => {
    const keys = [item.name, ...(item.aliases || [])].map(norm);
    return keys.includes(n) || keys.some((k) => k.split(' ').pop() === n && n.length > 4);
  });
  return row?.path || '';
}

export function photosForVersus(versus) {
  if (!versus) return [];
  const seen = new Set();
  const out = [];
  for (const part of versus.split('/')) {
    const path = portraitFor(part.trim());
    if (path && !seen.has(path)) {
      seen.add(path);
      out.push(path);
    }
  }
  return out;
}

export function heroImageForArticle(data) {
  if (!data) return '';
  const poster = posterForVersus(data.coverVersus || '');
  if (poster) return poster;
  if (data.photo) return data.photo;
  const versusPhotos = photosForVersus(data.coverVersus || '');
  if (versusPhotos[0]) return versusPhotos[0];
  for (const name of namesFromHeadline(data.h1)) {
    const path = portraitFor(name);
    if (path) return path;
  }
  if (data.image && !String(data.image).includes('og-combat-boxe')) return data.image;
  return '';
}

export function articleThumb(data) {
  const hero = heroImageForArticle(data);
  if (hero) return hero;
  return '';
}

function lastToken(value) {
  return norm(value).split(' ').pop();
}

export function posterForVersus(versus) {
  if (!versus) return '';
  const parts = versus
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return '';
  const hit = POSTERS.find((row) =>
    parts.every((part) => {
      const p = norm(part);
      return row.names.some((name) => {
        const n = norm(name);
        return p === n || lastToken(p) === lastToken(n);
      });
    }),
  );
  return hit?.path || '';
}

export function fightMedia(versus, index = 0, options = {}) {
  const poster = posterForVersus(versus);
  if (poster) return { srcs: [poster], kind: 'poster' };
  const photos = photosForVersus(versus);
  if (photos.length) return { srcs: photos, kind: 'portrait' };
  if (options.allowScene === false) return { srcs: [], kind: 'none' };
  return { srcs: [SCENES[Math.abs(Number(index) || 0) % SCENES.length]], kind: 'scene' };
}
