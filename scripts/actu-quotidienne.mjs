#!/usr/bin/env node
/**
 * Publication quotidienne. Lit des pages officielles, compare aux articles
 * déjà en ligne, et n'écrit un texte que s'il reste un fait nouveau sourcé.
 *
 * GitHub Actions : secret ANTHROPIC_API_KEY.
 * Local : même clé dans .env
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = resolve(root, 'src/content/articles');

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

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'CombatBoxeBot/1.0' } });
  if (!res.ok) return '';
  const html = await res.text();
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 8000);
}

function existingSlugs() {
  return readdirSync(articlesDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
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

async function main() {
  loadEnv();
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('ANTHROPIC_API_KEY manquante. Ajoute le secret GitHub pour la publication auto.');
    process.exit(0);
  }

  const slugs = existingSlugs();
  const feeds = [
    ['FFB evenements', 'https://www.ffboxe.com/evenements/'],
    ['WBC news', 'https://wbcboxing.com/en/news/'],
    ['CBS boxing schedule', 'https://www.cbssports.com/boxing/news/boxing-schedule-for-2026-dates-location-fights-canelo-alvarez-sebastian-fundora/'],
    ['ESPN boxing schedule', 'https://www.espn.co.uk/boxing/story/_/id/12508267/boxing-schedule'],
    ['Ville Saint-Nazaire boxe', 'https://www.saintnazaire.fr/agenda/championnat-de-france-de-boxe-professionnelle-et-3-combats-pro/'],
    ['CPB Blois', 'http://www.blois-boxe.com/pages/la-nuit-des-rois.html'],
    ['Sud Ouest Royan', 'https://www.sudouest.fr/sport/boxe/avant-de-penser-aux-jeux-olympiques-le-boxeur-royannais-makan-traore-disputera-son-championnat-de-france-a-domicile-le-31-octobre-30430836.php'],
    ['The O2 Dubois', 'https://www.theo2.co.uk/events/detail/dubois-vs-wardley-2'],
  ];
  const pages = [];
  for (const [name, url] of feeds) {
    const text = await fetchText(url);
    if (text) pages.push({ name, url, text });
  }

  const system = `Tu es rédacteur de Combat Boxe, média français de boxe anglaise.
Réponds en JSON strict, sans markdown.
Si aucun fait NOUVEAU n'est assez précis (date, deux boxeurs, lieu, source), réponds {"skip": true, "reason": "..."}.
Sinon {"skip": false, "slug": "...", "title": "...", "h1": "...", "description": "...", "kind": "annonce", "family": "actualite", "date": "2026-10-06T08:00:00", "coverVersus": "NomA / NomB", "coverMeta": "date · ville · catégorie", "sourceName": "...", "sourceUrl": "https://...", "pillars": [{"href":"/combats-a-venir","label":"Combats à venir"}], "body": "article markdown sans H1, français journalistique, faits uniquement, pas de liste de sources en bas, pas d'emoji"}.
Interdit : inventer un adversaire, un record, une date. Interdit de reprendre un slug déjà publié.`;

  const user = `Slugs déjà publiés : ${slugs.join(', ')}
Pages lues :
${pages.map((p) => `### ${p.name} (${p.url})\n${p.text}`).join('\n\n')}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.IA_MODEL || 'claude-sonnet-4-5',
      max_tokens: 2500,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  const raw = json.content.map((p) => p.text).join('\n').replace(/```json|```/g, '').trim();
  const data = JSON.parse(raw);
  if (data.skip) {
    console.log('Pas de nouvelle actu :', data.reason || 'aucun fait nouveau');
    return;
  }
  if (!data.slug || slugs.includes(data.slug) || !data.sourceUrl || !data.body) {
    console.log('Réponse incomplète, rien n\'est publié.');
    return;
  }
  const out = resolve(articlesDir, `${data.slug}.md`);
  writeFileSync(out, toFrontmatter(data, data.body.trim()));
  console.log('Article publié :', out);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
