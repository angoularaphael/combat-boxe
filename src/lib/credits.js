import credits from '../data/photo-credits.json';

export function creditForPhoto(path) {
  if (!path) return null;
  return credits.find((item) => item.path === path) || null;
}

export function creditLine(credit) {
  if (!credit) return '';
  const who = credit.artist || credit.name || '';
  const license = credit.license && credit.license !== 'editorial' ? credit.license : '';
  return [who, license].filter(Boolean).join(', ');
}
