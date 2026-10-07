import credits from '../data/photo-credits.json';

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

const POSTERS = [
  {
    names: ['brice clavier', 'gaetan ntambwe'],
    path: '/img/posters/clavier-ntambwe.jpg',
  },
  {
    names: ['floyd schofield iii', 'floyd schofield', 'lucas bahdi'],
    path: '/img/posters/schofield-bahdi.jpg',
  },
  {
    names: ['bakary samake', 'uisma lima'],
    path: '/img/posters/samake-lima.jpg',
  },
];

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

export function articleThumb(data) {
  if (data?.photo) return data.photo;
  const photos = photosForVersus(data?.coverVersus || '');
  return photos[0] || '';
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

export function fightMedia(versus, index = 0) {
  const poster = posterForVersus(versus);
  if (poster) return { srcs: [poster], kind: 'poster' };
  const photos = photosForVersus(versus);
  if (photos.length) return { srcs: photos, kind: 'portrait' };
  return { srcs: [SCENES[Math.abs(Number(index) || 0) % SCENES.length]], kind: 'scene' };
}
