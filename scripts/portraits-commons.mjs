/**
 * Portraits nommés : Wikipedia / Wikimedia Commons uniquement.
 * On ignore les fichiers « fair use » hébergés sur Wikipédia (pas Commons).
 */
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const UA = 'CombatBoxe/1.0 (https://combat-boxe.com; media independant de boxe)';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/img/boxers');
const registryPath = resolve(root, 'src/data/photo-credits.json');

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function wikiJson(lang, params) {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.search = new URLSearchParams({ format: 'json', origin: '*', ...params }).toString();
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) return null;
  return res.json();
}

async function pageImage(lang, title) {
  const json = await wikiJson(lang, {
    action: 'query',
    prop: 'pageimages|extracts',
    piprop: 'thumbnail|name',
    pithumbsize: '1600',
    exintro: '1',
    explaintext: '1',
    redirects: '1',
    titles: title,
  });
  const page = json && Object.values(json.query?.pages || {})[0];
  if (!page || page.missing || !page.thumbnail?.source) return null;
  const extract = `${page.title || ''} ${page.extract || ''}`.toLowerCase();
  const isBoxer = /boxeur|boxer|boxing|boxe anglaise|poids lourds|super-|ボクサー|pugil|olympi/.test(extract);
  if (!isBoxer) return null;
  if ((page.thumbnail.width || 0) < 1000) return null;
  const source = page.thumbnail.source;
  if (!source.includes('/wikipedia/commons/')) return null;
  return { source, file: page.pageimage || '', title: page.title };
}

async function commonsLicense(fileName) {
  if (!fileName) return null;
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: `File:${fileName}`,
    prop: 'imageinfo',
    iiprop: 'extmetadata|url',
    origin: '*',
  }).toString();
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const page = Object.values(json.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  const meta = info?.extmetadata || {};
  const license = meta.LicenseShortName?.value || meta.UsageTerms?.value || '';
  const artist = (meta.Artist?.value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return { license, artist, pageUrl: info?.descriptionshorturl || info?.descriptionurl || '' };
}

function licenseOk(license = '') {
  const t = license.toLowerCase();
  return t.includes('cc') || t.includes('public domain') || t.includes('pd') || t.includes('cc0');
}

async function commonsImageSearch(name) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: `"${name}" (boxer OR boxeur OR boxing OR boxe OR ボクサー)`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
  }).toString();
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = Object.values(json.query?.pages || {});
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !String(info.mime || '').startsWith('image/')) continue;
    if (!String(info.url || '').includes('/wikipedia/commons/')) continue;
    const meta = info.extmetadata || {};
    const blob = `${page.title || ''} ${meta.ImageDescription?.value || ''} ${meta.Categories?.value || ''}`.toLowerCase();
    if (!/boxer|boxeur|boxing|boxe|pugil|ボクサー/.test(blob)) continue;
    if (/hockey|nhl|footballer|soccer|baseball|cricket/.test(blob)) continue;
    if (/mural|graffiti|covid|affiche|poster|notice|fermeture/.test(blob)) continue;
    const license = meta.LicenseShortName?.value || meta.UsageTerms?.value || '';
    if (!licenseOk(license)) continue;
    return {
      source: info.url,
      file: String(page.title || '').replace(/^File:/i, ''),
      title: name,
      license,
      artist: (meta.Artist?.value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      pageUrl: info.descriptionshorturl || info.descriptionurl || '',
    };
  }
  return null;
}

export async function findPortrait(name, extraTitles = []) {
  const titles = [
    `${name} (boxer)`,
    `${name} (boxeur)`,
    ...extraTitles,
    name,
  ];
  for (const lang of ['en', 'fr', 'ja', 'de', 'es']) {
    for (const title of titles) {
      const hit = await pageImage(lang, title);
      if (!hit) continue;
      const cred = await commonsLicense(hit.file);
      if (!licenseOk(cred?.license)) continue;
      return {
        name,
        lang,
        wikiTitle: hit.title,
        source: hit.source,
        file: hit.file,
        license: cred.license,
        artist: cred.artist,
        pageUrl: cred.pageUrl,
      };
    }
  }
  const commons = await commonsImageSearch(name);
  if (!commons) return null;
  return {
    name,
    lang: 'commons',
    wikiTitle: commons.title,
    source: commons.source,
    file: commons.file,
    license: commons.license,
    artist: commons.artist,
    pageUrl: commons.pageUrl,
  };
}

export async function savePortrait(found) {
  mkdirSync(outDir, { recursive: true });
  const slug = slugify(found.name);
  const ext = found.source.match(/\.(jpe?g|png|webp)/i)?.[1]?.toLowerCase() || 'jpg';
  const local = `/img/boxers/${slug}.${ext === 'jpeg' ? 'jpg' : ext}`;
  const dest = resolve(root, 'public' + local);
  if (!existsSync(dest)) {
    const res = await fetch(found.source, { headers: { 'user-agent': UA } });
    if (!res.ok) return null;
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  }
    const last = found.name.split(/\s+/).pop();
    return {
      name: found.name,
      slug,
      path: local,
      license: found.license,
      artist: found.artist,
      pageUrl: found.pageUrl,
      wikiTitle: found.wikiTitle,
      aliases: last && last !== found.name ? [last] : [],
    };
}

export function loadRegistry() {
  if (!existsSync(registryPath)) return [];
  return JSON.parse(readFileSync(registryPath, 'utf8'));
}

export function saveRegistry(rows) {
  writeFileSync(registryPath, JSON.stringify(rows, null, 2) + '\n');
}

export async function portraitsForNames(names, extraMap = {}) {
  const registry = loadRegistry();
  const byName = new Map(registry.map((r) => [r.name.toLowerCase(), r]));
  const saved = [];
  for (const name of names) {
    const existing = byName.get(name.toLowerCase());
    if (existing && existsSync(resolve(root, 'public' + existing.path))) {
      saved.push(existing);
      continue;
    }
    const found = await findPortrait(name, extraMap[name] || []);
    if (!found) {
      console.log('Pas de portrait Commons :', name);
      continue;
    }
    const row = await savePortrait(found);
    if (!row) continue;
    console.log('Portrait :', name, '->', row.path, row.license);
    const next = registry.filter((r) => r.name.toLowerCase() !== name.toLowerCase());
    next.push(row);
    saveRegistry(next);
    registry.length = 0;
    registry.push(...next);
    saved.push(row);
  }
  return saved;
}
