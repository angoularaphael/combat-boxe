/**
 * Photos reelles des boxeurs nommes : Commons d'abord, puis pages de promoteurs.
 * Une scene generique n'est pas telechargee ici.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { portraitsForNames, loadRegistry, saveRegistry } from './portraits-commons.mjs';
import { bufferEstUnePhoto, cadrerPortrait, reduireAffiche } from './cadrer-portrait.mjs';

const UA = 'CombatBoxe/1.0 (https://combat-boxe.com; media independant de boxe)';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const boxersDir = resolve(root, 'public/img/boxers');
const postersDir = resolve(root, 'public/img/posters');
const postersPath = resolve(root, 'src/data/posters.json');

export function slugify(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function lastName(name) {
  return String(name).trim().split(/\s+/).pop() || '';
}

function creditExists(registry, name) {
  const n = name.toLowerCase();
  return registry.find((row) => {
    const keys = [row.name, ...(row.aliases || [])].map((k) => String(k).toLowerCase());
    return keys.includes(n);
  });
}

function fileForCredit(row) {
  return row?.path ? resolve(root, 'public' + row.path) : '';
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html' },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    });
    if (!res.ok) return '';
    const type = res.headers.get('content-type') || '';
    if (!type.includes('html') && !type.includes('xml') && !type.includes('text')) return '';
    return await res.text();
  } catch {
    return '';
  }
}

function absoluteUrl(src, pageUrl) {
  try {
    return new URL(src, pageUrl).href;
  } catch {
    return '';
  }
}

function looksLikePhoto(url) {
  const u = url.toLowerCase();
  if (!u.startsWith('http')) return false;
  if (
    /logo|favicon|sprite|icon-|wordmark|placeholder|avatar-default|badge|spinner|pixel|1x1|tracking|clipart|vector|illustration|belt|ceinture|title-belt|champion-belt|no-photo|nophoto|default-boxer/.test(
      u,
    )
  ) {
    return false;
  }
  if (/\.(svg)(\?|$)/.test(u)) return false;
  return true;
}

function scorePhoto(url, name) {
  const u = url.toLowerCase();
  const slug = slugify(name);
  const last = slugify(lastName(name));
  let score = 0;
  if (u.includes(slug)) score += 6;
  if (last.length > 4 && u.includes(last)) score += 3;
  if (/\/photos\/|profile|portrait|headshot|fighter|boxer|cdn\/shop\/files/.test(u)) score += 4;
  if (/og:|opengraph|social/.test(u)) score += 1;
  if (/banner|header|nav-|hero-site|advert|belt|clipart/.test(u)) score -= 3;
  if (/\.(jpe?g|png|webp)(\?|$)/.test(u)) score += 2;
  return score;
}

function extractImageUrls(html, pageUrl) {
  const urls = [];
  const og =
    html.match(/property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)/i) ||
    html.match(/content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i);
  if (og) urls.push(absoluteUrl(og[1], pageUrl));
  for (const m of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)/gi)) {
    urls.push(absoluteUrl(m[1], pageUrl));
  }
  for (const m of html.matchAll(/srcset=["']([^"']+)/gi)) {
    const first = m[1].split(',')[0].trim().split(/\s+/)[0];
    urls.push(absoluteUrl(first, pageUrl));
  }
  return [...new Set(urls.filter(Boolean).filter(looksLikePhoto))];
}

function promoterPages(name) {
  const slug = slugify(name);
  const last = slugify(lastName(name));
  const pages = [
    `https://www.boxingtitlefights.com/boxer/${slug}`,
    `https://queensberry.co.uk/pages/${slug}`,
    `https://www.mostvaluablepromotions.com/athlete/${slug}/`,
    `https://www.matchroomboxing.com/fighters/${slug}/`,
    `https://eottm.com/fighter/${slug}/`,
    `https://www.goldenboypromotions.com/fighters/${slug}`,
    `https://toprank.com/boxers/${slug}`,
  ];
  if (last.length > 4 && last !== slug) {
    pages.push(`https://www.boxingtitlefights.com/boxer/${last}`);
    pages.push(`https://queensberry.co.uk/pages/${last}`);
  }
  return pages;
}

async function downloadBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'image/*,*/*' },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (type.includes('html') || type.includes('javascript')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!(await bufferEstUnePhoto(buf))) return null;
    return buf;
  } catch {
    return null;
  }
}

async function saveEditorialPortrait(name, buf, pageUrl, artist) {
  mkdirSync(boxersDir, { recursive: true });
  const slug = slugify(name);
  const dest = resolve(boxersDir, `${slug}.jpg`);
  writeFileSync(dest, buf);
  const framed = await cadrerPortrait(dest);
  const path = `/img/boxers/${slug}.jpg`;
  const last = lastName(name);
  const aliases = last && last.length > 4 && last !== name ? [last] : [];
  const row = {
    name,
    slug,
    path,
    license: 'editorial',
    artist,
    pageUrl,
    aliases,
  };
  const registry = loadRegistry();
  const next = registry.filter((r) => r.name.toLowerCase() !== name.toLowerCase());
  next.push(row);
  saveRegistry(next);
  return { row, framed };
}

async function findEditorialPortrait(name) {
  const pages = promoterPages(name);
  for (const pageUrl of pages) {
    const html = await fetchHtml(pageUrl);
    if (!html) continue;
    const title = `${html.match(/<title[^>]*>([^<]+)/i)?.[1] || ''} ${html.slice(0, 1500)}`.toLowerCase();
    const token = lastName(name).toLowerCase();
    if (token.length > 3 && !title.includes(token.toLowerCase()) && !html.toLowerCase().includes(name.toLowerCase())) {
      continue;
    }
    const ranked = extractImageUrls(html, pageUrl)
      .map((url) => ({ url, score: scorePhoto(url, name) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    for (const item of ranked) {
      if (item.score < 2) continue;
      const buf = await downloadBuffer(item.url);
      if (!buf) continue;
      const host = new URL(pageUrl).hostname.replace(/^www\./, '');
      return saveEditorialPortrait(name, buf, pageUrl, host);
    }
  }
  return null;
}

function aDejaUnePhoto(name) {
  const existing = creditExists(loadRegistry(), name);
  return existing && existsSync(fileForCredit(existing)) ? existing : null;
}

export async function photosPourNoms(names) {
  mkdirSync(boxersDir, { recursive: true });
  const unique = [...new Set(names.map((n) => String(n || '').trim()).filter(Boolean))];
  const saved = [];
  const missing = [];
  for (const name of unique) {
    const existing = aDejaUnePhoto(name);
    if (existing) {
      saved.push(existing);
      continue;
    }
    missing.push(name);
  }
  if (!missing.length) return saved;
  const commons = await portraitsForNames(missing);
  for (const row of commons) {
    const file = fileForCredit(row);
    if (file && existsSync(file)) await cadrerPortrait(file);
    saved.push(row);
  }
  for (const name of missing) {
    if (aDejaUnePhoto(name)) continue;
    console.log('Recherche editoriale :', name);
    const found = await findEditorialPortrait(name);
    if (!found) {
      console.log('Pas de photo reelle :', name);
      continue;
    }
    console.log('Photo editoriale :', name, '->', found.row.path);
    saved.push(found.row);
  }
  return saved;
}

function unquote(value) {
  return String(value || '')
    .replace(/\\(['"])/g, '$1')
    .trim();
}

export function nomsDuSite() {
  const names = new Set();
  const add = (value) => {
    const trimmed = unquote(value);
    if (trimmed.length >= 3) names.add(trimmed);
  };
  const entities = readFileSync(resolve(root, 'src/data/entities.js'), 'utf8');
  for (const m of entities.matchAll(/boxer[AB]:\s*(['"])((?:\\.|[^\\])*?)\1/g)) add(m[2]);
  for (const file of ['combats-auto.json']) {
    const rows = JSON.parse(readFileSync(resolve(root, 'src/data', file), 'utf8'));
    for (const fight of rows) {
      add(fight.boxerA);
      add(fight.boxerB);
    }
  }
  const articlesDir = resolve(root, 'src/content/articles');
  for (const name of readdirSync(articlesDir).filter((n) => n.endsWith('.md'))) {
    const md = readFileSync(resolve(articlesDir, name), 'utf8');
    const vs = md.match(/coverVersus:\s*(['"])((?:\\.|[^\\])*?)\1/);
    if (!vs) continue;
    for (const part of vs[2].split('/')) {
      const trimmed = unquote(part);
      if (/\s/.test(trimmed)) add(trimmed);
    }
  }
  return [...names];
}

export function loadPosters() {
  if (!existsSync(postersPath)) return [];
  return JSON.parse(readFileSync(postersPath, 'utf8'));
}

export function savePosters(rows) {
  writeFileSync(postersPath, JSON.stringify(rows, null, 2) + '\n');
}

export async function enregistrerAffiche({ names, url, sourceName }) {
  if (!names || names.length < 2 || !url) return null;
  const posters = loadPosters();
  const key = names.map((n) => slugify(n)).sort().join('-');
  if (posters.some((row) => row.path.includes(key) || names.every((n) => row.names.includes(n.toLowerCase())))) {
    return posters.find((row) => row.path.includes(key)) || null;
  }
  const buf = await downloadBuffer(url);
  if (!buf) {
    console.log('Affiche inaccessible :', url);
    return null;
  }
  mkdirSync(postersDir, { recursive: true });
  const slug = `${slugify(names[0])}-${slugify(names[1])}`;
  const dest = resolve(postersDir, `${slug}.jpg`);
  writeFileSync(dest, buf);
  await reduireAffiche(dest);
  const row = {
    names: names.map((n) => n.toLowerCase()),
    path: `/img/posters/${slug}.jpg`,
    sourceName: sourceName || '',
    sourceUrl: url,
  };
  posters.push(row);
  savePosters(posters);
  console.log('Affiche :', names.join(' / '), '->', row.path);
  return row;
}
