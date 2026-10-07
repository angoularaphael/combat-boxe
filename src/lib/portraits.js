import credits from '../data/photo-credits.json';

function norm(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const local = [{ keys: ['valentin guth', 'guth'], path: '/img/valentin-guth-hero.jpg' }];

export function portraitFor(name) {
  if (!name) return '';
  const n = norm(name);
  const localHit = local.find((row) => row.keys.some((k) => n === norm(k) || n.endsWith(' ' + norm(k))));
  if (localHit) return localHit.path;
  const row = credits.find((item) => {
    const keys = [item.name, ...(item.aliases || [])].map(norm);
    return keys.includes(n) || keys.some((k) => k.split(' ').pop() === n && n.length > 3);
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

export function articleThumb(data) {
  if (data?.photo) return data.photo;
  const photos = photosForVersus(data?.coverVersus || '');
  return photos[0] || '';
}

const STOCK = [
  '/img/boxing-sparring.jpg',
  '/img/boxing-ring-blue.jpg',
  '/img/boxing-ring-corner.jpg',
  '/img/boxing-gloves.jpg',
  '/img/boxing-pads.jpg',
  '/img/boxing-training.jpg',
];

export function fightMedia(versus, index = 0) {
  const photos = photosForVersus(versus);
  if (photos.length) return photos;
  return [STOCK[Math.abs(Number(index) || 0) % STOCK.length]];
}
