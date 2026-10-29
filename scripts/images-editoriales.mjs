/**
 * Photos reelles des boxeurs nommes : Commons, promoteurs, puis google.com
 * (Images, grandes tailles). Jamais Bing ni une miniature th.bing.com.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { portraitsForNames, loadRegistry, saveRegistry } from './portraits-commons.mjs';
import { namesFromHeadline } from '../src/lib/headline-names.js';
import { bordsLaterauxBlancs, bufferEstUnePhoto, cadrerPortrait, notePortrait, reduireAffiche } from './cadrer-portrait.mjs';
import sharp from 'sharp';

const UA = 'CombatBoxe/1.0 (https://combat-boxe.com; media independant de boxe)';
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
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
      headers: {
        'user-agent': /instagram\.com|google\.com/i.test(url) ? BROWSER_UA : UA,
        accept: 'text/html',
        'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
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

function urlVignetteMoteur(url) {
  const u = String(url || '').toLowerCase();
  return /(?:^|\.)bing\.com|bing\.net|tse\d+\.mm\.bing|th\.bing\.com|msn\.com|encrypted-tbn|lookaside\.instagram\.com|lookaside\.fbsbx|gstatic\.com\/images|googleusercontent\.com\/proxy/.test(
    u,
  );
}

function estPostInstagram(url) {
  return /instagram\.com\/(?:p|reel|tv)\//i.test(String(url || ''));
}

function looksLikePhoto(url) {
  const u = url.toLowerCase();
  if (!u.startsWith('http')) return false;
  if (urlVignetteMoteur(u)) return false;
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
  if (/og:|opengraph|social|thumb|-\d{2,3}x\d{2,3}|small|tiny|blur/.test(u)) score -= 4;
  if (/-\d{3,4}w|large|original|full/.test(u)) score += 3;
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
    let best = '';
    let bestW = 0;
    for (const part of m[1].split(',')) {
      const bits = part.trim().split(/\s+/);
      const src = bits[0];
      const w = Number((bits[1] || '').replace('w', '')) || 0;
      if (w >= bestW) {
        bestW = w;
        best = src;
      }
    }
    if (best) urls.push(absoluteUrl(best, pageUrl));
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
    `https://boxe-toulouse.com/`,
    `https://boxingcenter.fr/`,
  ];
  if (last.length > 4 && last !== slug) {
    pages.push(`https://www.boxingtitlefights.com/boxer/${last}`);
    pages.push(`https://queensberry.co.uk/pages/${last}`);
  }
  return pages;
}

function decodeGoogleField(raw) {
  try {
    return JSON.parse(`"${String(raw).replace(/"/g, '\\"')}"`);
  } catch {
    return String(raw)
      .replace(/\\u002F/gi, '/')
      .replace(/\\u003d/gi, '=')
      .replace(/\\u0026/gi, '&');
  }
}

function extraireUrlsGoogleImages(html) {
  const urls = [];
  for (const m of html.matchAll(/data-lpage="(https?:[^"]+)"/g)) {
    urls.push(m[1]);
  }
  for (const m of html.matchAll(/"ou":"(https?:[^"]+)"/g)) {
    urls.push(decodeGoogleField(m[1]));
  }
  for (const m of html.matchAll(/imgurl=(https?[^&"]+)/g)) {
    try {
      urls.push(decodeURIComponent(m[1]));
    } catch {
      urls.push(m[1]);
    }
  }
  for (const m of html.matchAll(/\["(https?:\/\/[^"]+\.(?:jpe?g|png|webp)[^"]*)"/gi)) {
    urls.push(decodeGoogleField(m[1]));
  }
  return [...new Set(urls.filter((u) => !urlVignetteMoteur(u) && (/^https?:\/\//.test(u))))];
}

async function fetchGoogleHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': BROWSER_UA,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
        cookie: 'CONSENT=YES+; SOCS=CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjQwNTI5LjA2X3AxGgJlbiACGgYIAfi8sAY',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

let googleBrowserPromise = null;

function estHebergeurBot() {
  return process.platform === 'linux' && /\/home\/container/.test(process.cwd());
}

async function obtenirNavigateurGoogle() {
  if (googleBrowserPromise) return googleBrowserPromise;
  googleBrowserPromise = (async () => {
    let pw;
    try {
      pw = await import('playwright');
    } catch {
      return null;
    }
    try {
      return await pw.chromium.launch({
        headless: true,
        timeout: 30000,
        args: estHebergeurBot()
          ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
          : [],
      });
    } catch (err) {
      console.log('Navigateur google.com indisponible :', err.message || err);
      return null;
    }
  })();
  const browser = await googleBrowserPromise;
  if (!browser) googleBrowserPromise = null;
  return browser;
}

export async function fermerNavigateurGoogle() {
  const pending = googleBrowserPromise;
  googleBrowserPromise = null;
  if (!pending) return;
  const browser = await pending.catch(() => null);
  if (browser) await browser.close().catch(() => {});
}

function extraireImageInstagramHtml(html) {
  if (!html) return '';
  const og =
    html.match(/property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)/i) ||
    html.match(/content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i);
  if (og && /cdninstagram|scontent|fbcdn/i.test(og[1]) && !urlVignetteMoteur(og[1])) return og[1];
  const display = html.match(/"display_url":"(https:[^"]+)"/);
  if (display) {
    const url = decodeGoogleField(display[1]);
    if (url && !urlVignetteMoteur(url)) return url;
  }
  const urls = extractImageUrls(html, 'https://www.instagram.com/').filter(
    (u) => !urlVignetteMoteur(u) && /cdninstagram|scontent|fbcdn/i.test(u),
  );
  return urls[0] || '';
}

async function imageDepuisInstagramNavigateur(browser, postUrl) {
  const page = await browser.newPage({ userAgent: BROWSER_UA, locale: 'fr-FR' });
  try {
    await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise((done) => setTimeout(done, 1600));
    const url = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')].filter((img) =>
        /scontent|cdninstagram|fbcdn/i.test(img.src || ''),
      );
      imgs.sort((a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight);
      return imgs[0]?.src || '';
    });
    return url && !urlVignetteMoteur(url) ? url : '';
  } catch {
    return '';
  } finally {
    await page.close().catch(() => {});
  }
}

export async function imageDepuisInstagram(postUrl) {
  if (!estPostInstagram(postUrl)) return '';
  const html = await fetchHtml(postUrl);
  const fromHtml = extraireImageInstagramHtml(html);
  if (fromHtml) return fromHtml;
  const browser = await obtenirNavigateurGoogle();
  if (!browser) return '';
  return imageDepuisInstagramNavigateur(browser, postUrl);
}

async function imagesDepuisPageSource(pageUrl) {
  if (!pageUrl || urlVignetteMoteur(pageUrl)) return [];
  if (estPostInstagram(pageUrl)) {
    const ig = await imageDepuisInstagram(pageUrl);
    return ig ? [ig] : [];
  }
  const html = await fetchHtml(pageUrl);
  return extractImageUrls(html, pageUrl).slice(0, 8);
}

async function chercherImagesGoogleNavigateur(query, { limit = 12 } = {}) {
  const browser = await obtenirNavigateurGoogle();
  if (!browser) return [];
  const page = await browser.newPage({ userAgent: BROWSER_UA, locale: 'fr-FR' });
  const found = [];
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&udm=2&tbs=isz:l&hl=fr&gl=fr&pws=0`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise((done) => setTimeout(done, 1800));
    const extracted = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('[data-lpage]')]
        .map((el) => el.getAttribute('data-lpage'))
        .filter(Boolean);
      const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.href);
      return { pages, hrefs };
    });
    const sources = [
      ...extracted.pages,
      ...extracted.hrefs.filter((href) => /instagram\.com\/(?:p|reel)\//i.test(href) || /facebook\.com\//i.test(href)),
    ];
    for (const src of [...new Set(sources)]) {
      if (urlVignetteMoteur(src)) continue;
      const images = await imagesDepuisPageSource(src);
      for (const image of images) {
        if (looksLikePhoto(image) && !urlVignetteMoteur(image)) found.push(image);
      }
      if (found.length >= limit) break;
    }
  } catch (err) {
    console.log('Recherche google.com echouee :', query, err.message || err);
  } finally {
    await page.close().catch(() => {});
  }
  return [...new Set(found)].slice(0, limit);
}

export async function chercherImagesGoogle(query, { limit = 12 } = {}) {
  const q = String(query || '').trim();
  if (q.length < 4) return [];
  const urls = [
    `https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch&tbs=isz:l&hl=fr&gl=fr&pws=0`,
    `https://www.google.com/search?q=${encodeURIComponent(q)}&udm=2&hl=fr&gl=fr&pws=0`,
  ];
  const found = [];
  for (const page of urls) {
    const html = await fetchGoogleHtml(page);
    if (!html) continue;
    for (const item of extraireUrlsGoogleImages(html)) {
      if (/\.(jpe?g|png|webp)(\?|$)/i.test(item) && looksLikePhoto(item)) found.push(item);
      else if (/instagram\.com\/(?:p|reel)\//i.test(item) || /^https?:\/\//.test(item)) {
        const images = await imagesDepuisPageSource(item);
        found.push(...images);
      }
    }
    if (found.length >= limit) break;
  }
  const unique = [...new Set(found.filter((u) => looksLikePhoto(u) && !urlVignetteMoteur(u)))].slice(0, limit);
  if (unique.length) return unique;
  console.log('google.com Images via navigateur :', q);
  return chercherImagesGoogleNavigateur(q, { limit });
}

async function resoudreUrlImage(url) {
  if (!url) return '';
  if (urlVignetteMoteur(url)) return '';
  if (estPostInstagram(url)) return (await imageDepuisInstagram(url)) || url;
  return url;
}

async function downloadBuffer(url) {
  const resolved = await resoudreUrlImage(url);
  if (!resolved || urlVignetteMoteur(resolved)) return null;
  try {
    const headers = { 'user-agent': BROWSER_UA, accept: 'image/*,*/*' };
    if (/cdninstagram|scontent|fbcdn/i.test(resolved)) headers.referer = 'https://www.instagram.com/';
    const res = await fetch(resolved, {
      headers,
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (type.includes('html') || type.includes('javascript')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!(await bufferEstUnePhoto(buf))) return null;
    const meta = await sharp(buf).metadata();
    const longSide = Math.max(meta.width || 0, meta.height || 0);
    if (longSide < 900) return null;
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
  let best = null;
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
      .slice(0, 8);
    for (const item of ranked) {
      if (item.score < 2) continue;
      const buf = await downloadBuffer(item.url);
      if (!buf) continue;
      const note = await notePortrait(buf);
      if (note < 0) continue;
      if (!best || note > best.note) best = { buf, note, pageUrl };
    }
  }
  if (!best) return findGooglePortrait(name);
  const host = new URL(best.pageUrl).hostname.replace(/^www\./, '');
  return saveEditorialPortrait(name, best.buf, best.pageUrl, host);
}

async function findGooglePortrait(name) {
  const queries = [`${name} boxer boxing`, `${name} boxeur`, `${name} boxing portrait`];
  for (const query of queries) {
    const urls = await chercherImagesGoogle(query, { limit: 10 });
    for (const url of urls) {
      const buf = await downloadBuffer(url);
      if (!buf) continue;
      const note = await notePortrait(buf);
      if (note < 0) continue;
      console.log('Photo Google :', name, url);
      return saveEditorialPortrait(name, buf, url, 'google.com');
    }
  }
  return null;
}

export async function chercherAfficheGoogle(names, sourceUrls = []) {
  const list = (names || []).map((n) => String(n || '').trim()).filter(Boolean);
  if (list.length < 2) return null;
  for (const pageUrl of (sourceUrls || []).filter(Boolean)) {
    const images = await imagesDepuisPageSource(pageUrl);
    for (const url of images) {
      const host = (() => {
        try {
          return new URL(pageUrl).hostname.replace(/^www\./, '');
        } catch {
          return 'source';
        }
      })();
      const row = await enregistrerAffiche({ names: list, url, sourceName: host });
      if (row) return row;
    }
  }
  const queries = [
    `${list.join(' ')} boxing poster`,
    `${list.join(' ')} boxe affiche`,
    `${list[0]} vs ${list[1]} boxing official poster`,
    `${list.join(' ')} DAZN poster`,
  ];
  try {
    for (const query of queries) {
      const urls = await chercherImagesGoogle(query, { limit: 12 });
      for (const url of urls) {
        const row = await enregistrerAffiche({ names: list, url, sourceName: 'google.com' });
        if (row) return row;
      }
    }
    return null;
  } finally {
    await fermerNavigateurGoogle();
  }
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
  try {
  for (const name of unique) {
    const existing = aDejaUnePhoto(name);
    if (existing) {
      const file = fileForCredit(existing);
      const moche = file && existsSync(file) ? await bordsLaterauxBlancs(readFileSync(file)) : false;
      if (!moche) {
        saved.push(existing);
        continue;
      }
      console.log('Portrait d identite a remplacer :', name);
    }
    missing.push(name);
  }
  if (!missing.length) return saved;
  const commons = await portraitsForNames(missing);
  for (const row of commons) {
    const file = fileForCredit(row);
    if (file && existsSync(file)) {
      const framed = await cadrerPortrait(file);
      if (framed) {
        const web = `/img/boxers/${basename(framed)}`;
        if (row.path !== web) {
          row.path = web;
          const registry = loadRegistry().map((item) => (item.slug === row.slug ? { ...item, path: web } : item));
          saveRegistry(registry);
        }
      }
    }
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
  } finally {
    await fermerNavigateurGoogle();
  }
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
    if (vs) {
      for (const part of vs[2].split('/')) {
        const trimmed = unquote(part);
        if (trimmed.split(/\s+/).filter(Boolean).length >= 2) add(trimmed);
      }
    }
    const h1 = md.match(/^h1:\s*(['"])(.*?)\1/m);
    if (h1) {
      for (const name of namesFromHeadline(unquote(h1[2]))) add(name);
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
  if (urlVignetteMoteur(url)) {
    console.log('Affiche refusee (vignette moteur, pas Google original) :', url);
    return null;
  }
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
