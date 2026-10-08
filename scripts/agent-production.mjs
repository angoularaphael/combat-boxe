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

function jourParis() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
}

function quotaArticles() {
  const n = Number.parseInt(process.env.AGENT_ARTICLES || '6', 10);
  if (!Number.isFinite(n) || n < 1) return 6;
  return Math.min(n, 12);
}

function articlesDuJour() {
  const jour = jourParis();
  let count = 0;
  for (const name of readdirSync(articlesDir).filter((n) => n.endsWith('.md'))) {
    const md = readFileSync(resolve(articlesDir, name), 'utf8');
    const hit = md.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
    if (hit && hit[1] === jour) count += 1;
  }
  return count;
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
      .slice(0, 12000);
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

function mergeRows(path, rows, keyFn) {
  const current = readJson(path);
  let changed = 0;
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const index = current.findIndex((item) => keyFn(item) === key);
    if (index < 0) {
      current.push(row);
      changed += 1;
      continue;
    }
    const next = { ...current[index] };
    for (const [field, value] of Object.entries(row)) {
      if (value) next[field] = value;
    }
    if (JSON.stringify(next) !== JSON.stringify(current[index])) {
      current[index] = next;
      changed += 1;
    }
  }
  if (changed) writeJson(path, current);
  return changed;
}

function combatValide(fight) {
  if (!fight?.boxerA || !fight?.boxerB || !fight?.date || !fight?.sourceUrl) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fight.date)) return false;
  if (!/^https?:\/\//.test(fight.sourceUrl)) return false;
  if (!fight.city) return false;
  return true;
}

function clePresente(name) {
  return Boolean(String(process.env[name] || '').trim());
}

function llmProvider() {
  const forced = String(process.env.IA_MODEL || '').trim();
  if (clePresente('ANTHROPIC_API_KEY')) {
    return {
      name: 'anthropic',
      model: forced.startsWith('claude') ? forced : 'claude-sonnet-4-5',
    };
  }
  if (clePresente('OPENAI_API_KEY')) {
    return {
      name: 'openai',
      model: forced.startsWith('gpt-') ? forced : 'gpt-4.1',
    };
  }
  if (clePresente('GEMINI_API_KEY')) {
    return {
      name: 'gemini',
      model: forced.startsWith('gemini') ? forced : 'gemini-2.5-pro',
    };
  }
  return null;
}

function parseJsonReply(raw) {
  const cleaned = String(raw || '')
    .replace(/```json|```/g, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('Reponse IA sans JSON');
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function callAnthropic(model, system, user) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 12000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.content.map((part) => part.text).join('\n');
}

async function callOpenAI(model, system, user) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      ...( /^(gpt-5|gpt-6|o\d)/.test(model) ? { max_completion_tokens: 12000 } : { temperature: 0.2, max_tokens: 12000 } ),
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.choices?.[0]?.message?.content || '';
}

async function callGemini(model, system, user) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 12000,
          responseMimeType: 'application/json',
        },
      }),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
}

async function callEditorialJson(provider, system, user) {
  let raw = '';
  if (provider.name === 'anthropic') raw = await callAnthropic(provider.model, system, user);
  else if (provider.name === 'openai') raw = await callOpenAI(provider.model, system, user);
  else raw = await callGemini(provider.model, system, user);
  return parseJsonReply(raw);
}

export async function runProductionAgent() {
  loadEnv();
  console.log('Agent production Combat Boxe');

  const knownFights = combatsConnus();

  const llm = llmProvider();
  const quota = quotaArticles();
  const deja = articlesDuJour();
  const places = Math.max(0, quota - deja);
  if (llm && places === 0) {
    console.log(`Quota du jour atteint (${deja}/${quota}). Pas d appel IA.`);
  } else if (llm) {
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
  "articles": [
    {
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
    "body": "article markdown sans H1. Au moins huit paragraphes, voix de chroniqueur. Ouvre sur la date, la ville, la salle, l'heure et la chaine des qu'elles sont dans les pages. Developpe chaque boxeur a partir des bilans et parcours ecrits dans les pages. Parle de la carte autour. Termine par plusieurs paragraphes de lecture, puis un dernier paragraphe qui donne le pronostic et nomme le vainqueur pressenti. Pas de cote inventee. Si aucun bilan, statut de champion, combat precedent ou avantage de salle n'est dans les pages, le dernier paragraphe ne nomme pas de vainqueur. Pas de liste de sources, pas d'emoji"
    }
  ],
  "fights": [{
    "status": "a-venir" ou "dispute",
    "date": "YYYY-MM-DD",
    "boxerA": "...",
    "boxerB": "...",
    "category": "",
    "titles": "",
    "city": "",
    "venue": "",
    "time": "",
    "channel": "",
    "aboutA": "",
    "aboutB": "",
    "analysis": "trois paragraphes separes par une ligne vide. Chronique du combat, faits des pages seulement.",
    "prediction": "deux paragraphes separes par une ligne vide. Le dernier nomme le vainqueur pressenti.",
    "stakes": "une phrase courte pour la carte",
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
  "notes": [{
    "date": "YYYY-MM-DD",
    "boxerA": "...",
    "boxerB": "...",
    "venue": "",
    "time": "",
    "channel": "",
    "aboutA": "",
    "aboutB": "",
    "analysis": "",
    "prediction": "",
    "sourceUrl": "https://..."
  }],
  "galas": [{
    "date": "YYYY-MM-DD",
    "name": "...",
    "city": "...",
    "note": "soirée, salle, chaine, heure si la page les donne",
    "sourceUrl": "https://..."
  }],
  "posters": [{
    "names": ["NomA", "NomB"],
    "url": "https://...jpg",
    "sourceName": "promoteur"
  }]
}

Aujourd'hui (Paris) : ${jourParis()}.
Ecris jusqu'a ${places} articles, un par fait distinct. Un fait peut etre un combat principal, un lever de rideau, un resultat, une signature, une pesee, une conference ou une soiree. Pas seulement l'affiche principale. Tableau vide s'il n'y a pas assez de faits nouveaux. N'invente pas pour remplir le quota.
Chaque article : slug different, sourceUrl, date, et au moins huit paragraphes. Ouvre sur la date, la ville, la salle, l'heure et la chaine des qu'elles sont dans les pages. Consacre ensuite un long passage a chaque personne nommee, uniquement avec les bilans, styles et parcours ecrits dans les pages. Termine par une lecture de plusieurs paragraphes, puis un dernier paragraphe de pronostic qui nomme le vainqueur pressenti. Sans bilan, sans statut de champion, sans combat precedent ni avantage de salle dans les pages, ce dernier paragraphe ne nomme personne. Pas de cote inventee. Parle aussi des autres combats de la meme soiree quand les pages les citent. analysis : trois paragraphes separes par une ligne vide, pour la fiche combat. prediction : deux paragraphes separes par une ligne vide, le dernier donne le choix. Champs vides si le fait n'est pas dans les pages. Ignore les slugs deja publies.
fights : combats absents du calendrier, date complete, deux noms, ville, sourceUrl. Remplis venue, time, channel, aboutA, aboutB, analysis, prediction, stakes. stakes reste une seule phrase pour la carte. analysis et prediction portent la longueur.
fightUpdates : resultat d'un combat DEJA au calendrier, seulement si le vainqueur et la methode sont sourcés.
notes : pour un combat DEJA au calendrier, complete analysis, prediction, aboutA, aboutB, venue, time, channel si les pages du jour le permettent. Ne repete pas une fiche deja complete. prediction vide si aucune base n'est dans les pages.
galas : soiree nouvelle avec date, nom, ville, et dans note la salle, la chaine et l'heure si la page les donne.
posters : uniquement une URL d'affiche officielle (les deux visages), jamais un logo.`;

    const user = `Slugs deja publies : ${slugs.join(', ')}
Combats deja au calendrier : ${knownList}

Pages lues :
${pages
  .map((p) => `### ${p.name} (${p.url})\n${p.text}\nImages: ${(p.images || []).join(' ')}`)
  .join('\n\n')}`;

    console.log('IA :', llm.name, llm.model);
    const data = await callEditorialJson(llm, system, user);

    const candidats = []
      .concat(Array.isArray(data.articles) ? data.articles : [])
      .concat(data.article ? [data.article] : []);
    const vus = new Set(slugs);
    let ecrits = 0;
    for (const article of candidats) {
      if (ecrits >= places) break;
      const slug = String(article?.slug || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '');
      if (!slug || vus.has(slug) || !article.sourceUrl || !article.body) continue;
      if (!/^https?:\/\//.test(article.sourceUrl)) continue;
      vus.add(slug);
      const out = resolve(articlesDir, `${slug}.md`);
      writeFileSync(out, toFrontmatter({ ...article, slug }, String(article.body).trim()));
      ecrits += 1;
      console.log('Article publie :', out);
    }
    if (!ecrits) console.log('Pas de nouvel article.');
    else console.log(`Articles du jour : ${deja + ecrits}/${quota}`);

    const nouveaux = (data.fights || []).filter(
      (fight) => combatValide(fight) && !dejaAuCalendrier(fight, knownFights),
    );
    const addedFights = appendUnique(combatsAutoPath, nouveaux, fightKey);
    if (addedFights) console.log('Combats ajoutes :', addedFights);

    const notes = (data.notes || []).filter(
      (row) => row?.date && row?.boxerA && row?.boxerB && row?.sourceUrl && /^https?:\/\//.test(row.sourceUrl),
    );
    const addedNotes = mergeRows(updatesPath, notes, fightKey);
    if (addedNotes) console.log('Fiches completees :', addedNotes);

    const updates = (data.fightUpdates || []).filter(combatValide);
    const addedUpdates = mergeRows(updatesPath, updates, fightKey);
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
    console.log('Pas de cle IA (Anthropic, OpenAI ou Gemini) : pas d article, les photos tournent quand meme.');
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
