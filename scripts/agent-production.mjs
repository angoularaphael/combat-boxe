#!/usr/bin/env node
/**
 * Agent Combat Boxe : un tour de publication.
 * En production, le process BotHosting (`scripts/serveur-production.mjs`)
 * l'appelle tout seul et pousse sur le depot GitHub principal.
 * Pas de GitHub Actions, pas de Cursor.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  nomsDuSite,
  photosPourNoms,
  enregistrerAffiche,
  slugify,
} from './images-editoriales.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = resolve(root, 'src/content/articles');
const combatsAutoPath = resolve(root, 'src/data/combats-auto.json');
const galasAutoPath = resolve(root, 'src/data/galas-auto.json');
const updatesPath = resolve(root, 'src/data/combats-updates.json');

const FEEDS = [
  ['FFB evenements', 'https://www.ffboxe.com/evenements/'],
  ['FFB championnats France', 'https://www.ffboxe.com/championnats-de-france-de-boxe-professionnelle/'],
  ['WBC events', 'https://wbcboxing.com/en/events/'],
  ['WBC news', 'https://wbcboxing.com/en/news/'],
  ['ESPN boxing schedule', 'https://www.espn.com/boxing/story/_/id/12508267/boxing-fight-schedule'],
  ['CBS boxing schedule', 'https://www.cbssports.com/boxing/news/boxing-schedule-for-2026-dates-location-fights-canelo-alvarez-sebastian-fundora/'],
  ['CanadianBoxing schedule', 'https://www.canadianboxing.com/schedule.htm'],
  ['BBC boxing', 'https://www.bbc.com/sport/boxing'],
  ['L Equipe boxe', 'https://www.lequipe.fr/Boxe/'],
  ['Boxe Magazine', 'https://boxemag.ouest-france.fr/'],
  ['Ring Magazine', 'https://www.ringtv.com/'],
  ['BoxingScene', 'https://www.boxingscene.com/'],
  ['Queensberry', 'https://queensberry.co.uk/blogs/queensberry-promotions-blog'],
  ['Most Valuable Promotions', 'https://www.mostvaluablepromotions.com/'],
  ['Principality Fury Joshua', 'https://www.principalitystadium.wales/event/tyson-fury-v-anthony-joshua/'],
  ['Ville Saint-Nazaire boxe', 'https://www.saintnazaire.fr/agenda/championnat-de-france-de-boxe-professionnelle-et-3-combats-pro/'],
  ['CPB Blois', 'http://www.blois-boxe.com/pages/la-nuit-des-rois.html'],
  ['Sud Ouest Royan', 'https://www.sudouest.fr/sport/boxe/avant-de-penser-aux-jeux-olympiques-le-boxeur-royannais-makan-traore-disputera-son-championnat-de-france-a-domicile-le-31-octobre-30430836.php'],
  ['The O2 Dubois', 'https://www.theo2.co.uk/events/detail/dubois-vs-wardley-2'],
  ['L Equipe Samake', 'https://www.lequipe.fr/Boxe/Actualites/Bakary-samake-tentera-de-se-relancer-contre-le-portugais-uisma-lima-le-14-novembre-a-levallois/1683337'],
  ['WBC Kabayel', 'https://wbcboxing.com/en/agit-kabayel-to-defend-wbc-world-heavyweight-title-against-nelson-hysa/'],
  ['Golden Boy', 'https://www.goldenboypromotions.com/'],
  ['Matchroom Boxing', 'https://www.matchroomboxing.com/'],
];

function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function readJson(path) {
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function existingSlugs() {
  return readdirSync(articlesDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

function combatsConnus() {
  const entities = readFileSync(resolve(root, 'src/data/entities.js'), 'utf8');
  const rows = [];
  const block = entities.match(/const combatsRaw = \[([\s\S]*?)\n\];/);
  const blob = block ? block[1] : entities;
  const parts = blob.split(/\{\s*status:/);
  for (const part of parts.slice(1)) {
    const date = part.match(/date:\s*(['"])((?:\\.|[^\\])*?)\1/)?.[2];
    const a = part.match(/boxerA:\s*(['"])((?:\\.|[^\\])*?)\1/)?.[2]?.replace(/\\(['"])/g, '$1');
    const b = part.match(/boxerB:\s*(['"])((?:\\.|[^\\])*?)\1/)?.[2]?.replace(/\\(['"])/g, '$1');
    if (date && a && b) rows.push({ date, boxerA: a, boxerB: b });
  }
  return [...rows, ...readJson(combatsAutoPath)];
}

function fightKey(fight) {
  const n = (v) =>
    String(v)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  return `${fight.date}|${n(fight.boxerA)}|${n(fight.boxerB)}`;
}

function dejaAuCalendrier(fight, known) {
  const key = fightKey(fight);
  const swapped = fightKey({ date: fight.date, boxerA: fight.boxerB, boxerB: fight.boxerA });
  return known.some((row) => {
    const k = fightKey(row);
    return k === key || k === swapped;
  });
}

function toFrontmatter(data, body) {
  const pillars = (data.pillars || [])
    .map((p) => `  - href: ${p.href}\n    label: ${JSON.stringify(p.label)}`)
    .join('\n');
  return `---
slug: ${data.slug}
title: ${JSON.stringify(data.title)}
description: ${JSON.stringify(data.description)}
h1: ${JSON.stringify(data.h1)}
date: ${data.date}
status: published
family: ${data.family || 'actualite'}
kind: ${data.kind || 'annonce'}
image: /img/og-combat-boxe.jpg
imageAlt: "Combat Boxe"
coverVersus: ${JSON.stringify(data.coverVersus || '')}
coverMeta: ${JSON.stringify(data.coverMeta || '')}
breadcrumbs:
  - href: /actualites
    label: Actualités
  - href: /${data.slug}
    label: ${JSON.stringify(data.coverVersus || data.h1)}
pillars:
${pillars || '  []'}
sources:
  - name: ${JSON.stringify(data.sourceName)}
    url: ${data.sourceUrl}
---

${body}
`;
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'CombatBoxeBot/1.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return { text: '', images: [] };
    const html = await res.text();
    const images = [];
    const og =
      html.match(/property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)/i) ||
      html.match(/content=["']([^"']+)["'][^>]*property=["']og:image(?::secure_url)?["']/i);
    if (og) {
      try {
        images.push(new URL(og[1], url).href);
      } catch {
        /* ignore */
      }
    }
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 8000);
    return { text, images: [...new Set(images)] };
  } catch {
    return { text: '', images: [] };
  }
}

function appendUnique(path, rows, keyFn) {
  const current = readJson(path);
  const seen = new Set(current.map(keyFn));
  let added = 0;
  for (const row of rows) {
    const key = keyFn(row);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    current.push(row);
    added += 1;
  }
  if (added) writeJson(path, current);
  return added;
}

function combatValide(fight) {
  if (!fight?.boxerA || !fight?.boxerB || !fight?.date || !fight?.sourceUrl) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fight.date)) return false;
  if (!/^https?:\/\//.test(fight.sourceUrl)) return false;
  if (!fight.city) return false;
  return true;
}

export async function runProductionAgent() {
  loadEnv();
  console.log('Agent production Combat Boxe');

  const knownFights = combatsConnus();

  if (process.env.ANTHROPIC_API_KEY) {
    const pages = [];
    for (const [name, url] of FEEDS) {
      const page = await fetchPage(url);
      if (page.text) pages.push({ name, url, ...page });
    }

    const slugs = existingSlugs();
    const knownList = knownFights
      .map((f) => `${f.date} ${f.boxerA} / ${f.boxerB}`)
      .join(' ; ');

    const system = `Tu es l'agent de production de Combat Boxe, media francais de boxe anglaise.
Reponds en JSON strict, sans markdown.
Tu n'inventes aucun adversaire, record, date, vainqueur ou lieu.
Si un fait n'est pas explicite dans les pages, tu ne le poses pas.

Format :
{
  "article": null ou {
    "slug": "...",
    "title": "...",
    "h1": "...",
    "description": "...",
    "kind": "annonce",
    "family": "actualite",
    "date": "2026-10-07T08:00:00",
    "coverVersus": "NomA / NomB",
    "coverMeta": "date · ville · categorie",
    "sourceName": "...",
    "sourceUrl": "https://...",
    "pillars": [{"href":"/combats-a-venir","label":"Combats a venir"}],
    "body": "article markdown sans H1, francais journalistique, faits uniquement, pas de liste de sources, pas d'emoji"
  },
  "fights": [{
    "status": "a-venir" ou "dispute",
    "date": "YYYY-MM-DD",
    "boxerA": "...",
    "boxerB": "...",
    "category": "",
    "titles": "",
    "city": "",
    "stakes": "",
    "winner": "",
    "method": "",
    "decision": "",
    "sourceName": "",
    "sourceUrl": "https://..."
  }],
  "fightUpdates": [{
    "date": "YYYY-MM-DD",
    "boxerA": "...",
    "boxerB": "...",
    "status": "dispute",
    "winner": "...",
    "method": "...",
    "decision": "...",
    "stakes": "",
    "sourceName": "",
    "sourceUrl": "https://..."
  }],
  "galas": [{
    "date": "YYYY-MM-DD",
    "name": "...",
    "city": "...",
    "note": "...",
    "sourceUrl": "https://..."
  }],
  "posters": [{
    "names": ["NomA", "NomB"],
    "url": "https://...jpg",
    "sourceName": "promoteur"
  }]
}

article vaut null s'il n'y a pas de fait NOUVEAU assez precis (date, deux boxeurs, lieu, source) ou si le slug existe deja.
fights : seulement des combats absents du calendrier fourni, avec date complete, deux noms, ville et sourceUrl.
fightUpdates : resultat d'un combat DEJA au calendrier, seulement si le vainqueur et la methode sont sourcés.
galas : soiree nouvelle avec date, nom, ville.
posters : uniquement une URL d'affiche officielle (les deux visages), jamais un logo.`;

    const user = `Slugs deja publies : ${slugs.join(', ')}
Combats deja au calendrier : ${knownList}

Pages lues :
${pages
  .map((p) => `### ${p.name} (${p.url})\n${p.text}\nImages: ${(p.images || []).join(' ')}`)
  .join('\n\n')}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.IA_MODEL || 'claude-sonnet-4-5',
        max_tokens: 4000,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
    const raw = json.content
      .map((p) => p.text)
      .join('\n')
      .replace(/```json|```/g, '')
      .trim();
    const data = JSON.parse(raw);

    const article = data.article;
    if (article?.slug && !slugs.includes(article.slug) && article.sourceUrl && article.body) {
      const out = resolve(articlesDir, `${article.slug}.md`);
      writeFileSync(out, toFrontmatter(article, String(article.body).trim()));
      console.log('Article publie :', out);
    } else {
      console.log('Pas de nouvel article.');
    }

    const nouveaux = (data.fights || []).filter(
      (fight) => combatValide(fight) && !dejaAuCalendrier(fight, knownFights),
    );
    const addedFights = appendUnique(combatsAutoPath, nouveaux, fightKey);
    if (addedFights) console.log('Combats ajoutes :', addedFights);

    const updates = (data.fightUpdates || []).filter(combatValide);
    const addedUpdates = appendUnique(updatesPath, updates, fightKey);
    if (addedUpdates) console.log('Resultats mis a jour :', addedUpdates);

    const galas = (data.galas || []).filter(
      (g) => g?.date && g?.name && g?.city && g?.sourceUrl && /^\d{4}-\d{2}-\d{2}$/.test(g.date),
    );
    const addedGalas = appendUnique(galasAutoPath, galas, (g) => `${g.date}|${slugify(g.name)}|${slugify(g.city)}`);
    if (addedGalas) console.log('Galas ajoutes :', addedGalas);

    for (const poster of data.posters || []) {
      await enregistrerAffiche(poster);
    }
  } else {
    console.log('ANTHROPIC_API_KEY manquante : pas d article, les photos tournent quand meme.');
  }

  const names = nomsDuSite();
  console.log('Photos a verifier :', names.length);
  await photosPourNoms(names);
  console.log('Agent production termine.');
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (invoked) {
  runProductionAgent().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
