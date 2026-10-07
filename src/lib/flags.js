export const COUNTRY_LABELS = {
  fr: 'France',
  gb: 'Royaume-Uni',
  us: 'États-Unis',
  ca: 'Canada',
  sa: 'Arabie saoudite',
  de: 'Allemagne',
  jp: 'Japon',
  mx: 'Mexique',
  au: 'Australie',
  za: 'Afrique du Sud',
};

export function countryCodeFromCity(city = '') {
  const t = String(city)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (/japon|tokyo|osaka/.test(t)) return 'jp';
  if (/canada|quebec|montreal/.test(t)) return 'ca';
  if (/etats-unis|chicago|carson|san antonio|arlington|californie|las vegas|new york/.test(t)) return 'us';
  if (/royaume-uni|londres|manchester|sheffield|belfast|birmingham|cardiff|pays de galles|greenwich|angleterre/.test(t)) return 'gb';
  if (/arabie|riyad/.test(t)) return 'sa';
  if (/allemagne|dusseldorf|berlin|hambourg/.test(t)) return 'de';
  if (/mexique|guadalajara|mexico/.test(t)) return 'mx';
  if (/australie|sydney|melbourne/.test(t)) return 'au';
  if (/afrique du sud|johannesburg/.test(t)) return 'za';
  if (
    /france|saint-nazaire|marlenheim|royan|blois|levallois|toulouse|paris|nazaire/.test(t)
  ) {
    return 'fr';
  }
  return '';
}

export function countryLabel(code) {
  return COUNTRY_LABELS[code] || '';
}

export function placeLine(city = '', country = '') {
  const fold = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  if (!city) return country || '';
  if (!country || fold(city).includes(fold(country))) return city;
  return `${city} · ${country}`;
}

export function flagSrc(code) {
  if (!code) return '';
  return `https://flagcdn.com/w80/${code}.png`;
}

export function slugifyName(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
