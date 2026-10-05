#!/usr/bin/env node
/**
 * Rédige un article Combat Boxe à partir d'un JSON de faits sourcés.
 * Usage : node scripts/rediger-article.mjs --faits faits.json
 *
 * Clé : ANTHROPIC_API_KEY (recommandé), sinon OPENAI_API_KEY, sinon GEMINI_API_KEY.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || !process.argv[index + 1]) return '';
  return process.argv[index + 1];
}

function systemPrompt() {
  return `Tu rédiges pour Combat Boxe, média français de boxe anglaise.
Voix : journaliste sportif, clair, sérieux, informatif. Pas d'assistant, pas de méta-commentaire.
Règles :
- N'utilise QUE les faits fournis. N'invente aucun record, date, lieu, ceinture, citation.
- Si un chiffre n'est pas dans les faits, ne le mets pas.
- Commence par le fait. Pas de "sur ce média", "cet article présente".
- Français naturel. Phrases de longueurs variées.
- Ajoute des liens internes markdown uniquement vers les URLs des piliers fournis.
- Ne copie aucune phrase d'un autre média.
- Pas de visuel généré par IA, pas d'emoji.
- Réponds uniquement avec le corps de l'article en markdown : paragraphes et titres H2. Pas de frontmatter, pas de H1.`;
}

function userPrompt(data) {
  return `Rédige l'article à partir de ces éléments.

Titre H1 : ${data.h1}
Type : ${data.kind} / ${data.family}

Faits :
${(data.faits || []).map((f) => `- ${f}`).join('\n')}

Sources (à ne pas recopier, seulement s'appuyer) :
${(data.sources || []).map((s) => `- ${s.name} ${s.url}`).join('\n')}

Piliers à mailler si c'est naturel :
${(data.pillars || []).map((p) => `- ${p.label} (${p.href})`).join('\n')}
`;
}

async function callAnthropic(system, user, model) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-5',
      max_tokens: 2500,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.content.map((p) => p.text).join('\n').trim();
}

async function callOpenAI(system, user, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4.1',
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.choices[0].message.content.trim();
}

async function callGemini(system, user, model) {
  const name = model || 'gemini-2.5-pro';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2500 },
      }),
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json.candidates[0].content.parts.map((p) => p.text).join('\n').trim();
}

function toFrontmatter(data, body) {
  const pillars = (data.pillars || [])
    .map((p) => `  - href: ${p.href}\n    label: ${JSON.stringify(p.label)}`)
    .join('\n');
  const sources = (data.sources || [])
    .map((s) => `  - name: ${JSON.stringify(s.name)}\n    url: ${s.url}`)
    .join('\n');
  return `---
slug: ${data.slug}
title: ${JSON.stringify(data.title)}
description: ${JSON.stringify(data.description)}
h1: ${JSON.stringify(data.h1)}
date: ${data.date}
status: published
family: ${data.family}
kind: ${data.kind}
image: ${data.image}
imageAlt: ${JSON.stringify(data.imageAlt)}
breadcrumbs:
  - href: /actualites
    label: Actualités
  - href: /${data.slug}
    label: ${JSON.stringify(data.h1)}
pillars:
${pillars}
sources:
${sources}
---

${body}
`;
}

async function main() {
  loadEnv();
  const faitsPath = argValue('--faits');
  if (!faitsPath) {
    console.error('Indique un fichier de faits : node scripts/rediger-article.mjs --faits faits.json');
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(resolve(process.cwd(), faitsPath), 'utf8'));
  if (!data.slug || !data.faits?.length || !data.sources?.length) {
    console.error('Le JSON doit contenir slug, faits[] et sources[]. Sans source, pas d\'article.');
    process.exit(1);
  }

  const system = systemPrompt();
  const user = userPrompt(data);
  const forced = process.env.IA_MODEL || '';
  let body = '';

  if (process.env.ANTHROPIC_API_KEY) {
    body = await callAnthropic(system, user, forced);
  } else if (process.env.OPENAI_API_KEY) {
    body = await callOpenAI(system, user, forced);
  } else if (process.env.GEMINI_API_KEY) {
    body = await callGemini(system, user, forced);
  } else {
    console.error('Ajoute ANTHROPIC_API_KEY, OPENAI_API_KEY ou GEMINI_API_KEY dans .env');
    process.exit(1);
  }

  const out = resolve(root, 'src/content/articles', `${data.slug}.md`);
  writeFileSync(out, toFrontmatter(data, body));
  console.log(`Article écrit : ${out}`);
  console.log('Relire, puis npm run build, commit et push.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
