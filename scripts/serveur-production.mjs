#!/usr/bin/env node
/**
 * Process long Combat Boxe (BotHosting). Pas de GitHub Actions.
 * Tourne en continu, publie jusqu'a 6 articles par jour, pousse sur le depot principal.
 */
import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProductionAgent } from './agent-production.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || process.env.BOT_HTTP_PORT || 3000);
const HOURS = String(process.env.AGENT_HOURS || '8')
  .split(',')
  .map((h) => Number(h.trim()))
  .filter((h) => h >= 0 && h <= 23);
const AUTHOR_NAME = process.env.GIT_AUTHOR_NAME || 'Raphael';
const AUTHOR_EMAIL = process.env.GIT_AUTHOR_EMAIL || 'germainraphaelangoulaonambele@gmail.com';
const BRANCH = process.env.BOT_REPO_BRANCH || 'main';

let busy = false;
let lastSlot = '';
let lastStatus = 'demarrage';

function log(msg) {
  console.log(`[Combat Boxe] ${msg}`);
}

function heureParis() {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: 'numeric',
    hourCycle: 'h23',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return {
    hour: Number(get('hour')),
    slot: `${get('year')}-${get('month')}-${get('day')}-${get('hour')}`,
  };
}

function git(args, extraEnv = {}) {
  return execSync(`git ${args}`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...extraEnv, GIT_TERMINAL_PROMPT: '0' },
  });
}

function authedRepoUrl() {
  const raw = process.env.BOT_REPO_URL || 'https://github.com/boxing-center/combat-boxe.git';
  const token = process.env.GIT_PUSH_TOKEN || '';
  try {
    const url = new URL(raw);
    url.username = '';
    url.password = '';
    if (token && url.hostname === 'github.com') {
      url.username = 'x-access-token';
      url.password = token;
    }
    return url.toString();
  } catch {
    return 'https://github.com/boxing-center/combat-boxe.git';
  }
}

function pointOrigin() {
  const target = authedRepoUrl().replace(/"/g, '');
  try {
    git(`remote set-url origin "${target}"`);
  } catch {
    git(`remote add origin "${target}"`);
  }
}

function pushEnv() {
  const token = process.env.GIT_PUSH_TOKEN || '';
  if (!token) return { ...process.env, GIT_TERMINAL_PROMPT: '0' };
  return {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.extraHeader',
    GIT_CONFIG_VALUE_0: `Authorization: Bearer ${token}`,
  };
}

function hasChanges() {
  git('add src/content/articles src/data public/img');
  const cached = git('diff --cached --name-only').trim();
  return Boolean(cached);
}

async function cycle(reason) {
  if (busy) {
    log(`Cycle ignore (${reason}) : un tour tourne deja.`);
    return;
  }
  busy = true;
  lastStatus = `en cours (${reason})`;
  log(`Cycle : ${reason}`);
  try {
    try {
      pointOrigin();
      git(`fetch origin ${BRANCH}`, pushEnv());
      git(`pull --ff-only origin ${BRANCH}`, pushEnv());
    } catch (err) {
      log(`Pull ignore : ${(err.stderr || err.message || err).toString().replace(/x-access-token:[^@\s"]+/g, 'x-access-token:***').trim().slice(0, 200)}`);
    }

    await runProductionAgent();

    if (!hasChanges()) {
      log('Rien a pousser.');
      lastStatus = `ok vide (${reason})`;
      return;
    }
    if (!process.env.GIT_PUSH_TOKEN) {
      git('reset HEAD');
      log('GIT_PUSH_TOKEN manquant : fichiers ecrits sur le serveur, pas de push vers le depot principal.');
      lastStatus = 'token manquant';
      return;
    }
    git(`-c user.name="${AUTHOR_NAME}" -c user.email="${AUTHOR_EMAIL}" commit -m "Publie l'actualite, le calendrier et les visuels du jour."`);
    git(`push origin HEAD:${BRANCH}`, pushEnv());
    log('Pousse sur le depot principal. Vercel deploie.');
    lastStatus = `pousse (${reason})`;
  } catch (err) {
    lastStatus = `erreur (${reason})`;
    console.error('[Combat Boxe]', (err.stderr?.toString?.() || err.message || err).toString().replace(/x-access-token:[^@\s"]+/g, 'x-access-token:***'));
  } finally {
    busy = false;
  }
}

function tick() {
  const { hour, slot } = heureParis();
  if (!HOURS.includes(hour)) return;
  if (lastSlot === slot) return;
  lastSlot = slot;
  cycle(`horaire ${hour}h Paris`).catch((err) => console.error(err));
}

const server = createServer((req, res) => {
  const body = `Combat Boxe agent OK\nstatus: ${lastStatus}\nbusy: ${busy}\n`;
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(body);
});

server.listen(PORT, '0.0.0.0', () => {
  log(`Ecoute sur ${PORT}`);
  log(`Horaires Paris : ${HOURS.join('h, ')}h`);
  const hasLlm = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'].some((key) =>
    String(process.env[key] || '').trim(),
  );
  if (!existsSync(resolve(root, '.env')) && !hasLlm) {
    log('Pas de cle IA : les articles ne partiront pas, les photos oui.');
  }
  if (!process.env.GIT_PUSH_TOKEN) {
    log('Pas de GIT_PUSH_TOKEN : le depot principal ne sera pas mis a jour.');
  }
  setTimeout(() => {
    cycle('demarrage').catch((err) => console.error(err));
  }, 4000);
  setInterval(tick, 60 * 1000);
});
