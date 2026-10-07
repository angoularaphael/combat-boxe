#!/usr/bin/env node
/**
 * Agent Combat Boxe — 157.180.7.37:22077
 *
 * Upload sur le serveur :
 *   /home/container/index.js  (ce fichier)
 *   /home/container/.env
 *
 * Startup panel : node index.js
 *
 * Clone le depot principal angoularaphael/combat-boxe, lance l'agent
 * en continu. Pas de GitHub Actions. Les push partent vers ce depot,
 * Vercel deploie.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ENV_FILE = path.join(ROOT, '.env');
const APP_DIR = path.join(ROOT, 'combat-boxe-app');
const WANTED_REPO = 'https://github.com/angoularaphael/combat-boxe.git';

function log(msg) {
  console.log(`[Combat Boxe bootstrap] ${msg}`);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    log(`ATTENTION: .env manquant (${filePath})`);
    return;
  }
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === '') process.env[key] = val;
  }
}

function run(cmd, cwd = ROOT) {
  log(`> ${cmd.replace(/x-access-token:[^@]+@/g, 'x-access-token:***@')}`);
  execSync(cmd, { stdio: 'inherit', cwd, shell: true, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
}

function cloneUrl() {
  const configured = process.env.BOT_REPO_URL || WANTED_REPO;
  const token = process.env.GIT_PUSH_TOKEN || '';
  if (!token) return configured;
  try {
    const url = new URL(configured);
    if (url.hostname !== 'github.com') return configured;
    url.username = 'x-access-token';
    url.password = token;
    return url.toString();
  } catch {
    return configured;
  }
}

function gitOrigin(dir) {
  try {
    return execSync('git remote get-url origin', { cwd: dir, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

loadEnvFile(ENV_FILE);
process.env.PORT = process.env.PORT || process.env.BOT_HTTP_PORT || '3000';
const branch = process.env.BOT_REPO_BRANCH || 'main';

log(`.env ${fs.existsSync(ENV_FILE) ? 'OK' : 'MANQUANT'}`);
log(`PORT=${process.env.PORT}`);

const origin = fs.existsSync(APP_DIR) ? gitOrigin(APP_DIR) : '';
const wrong = Boolean(origin) && !/combat-boxe\.git/i.test(origin);
if (!fs.existsSync(path.join(APP_DIR, 'scripts', 'serveur-production.mjs')) || wrong) {
  if (fs.existsSync(APP_DIR)) {
    log(`Ancien depot retire (${origin || 'incomplet'})`);
    fs.rmSync(APP_DIR, { recursive: true, force: true });
  }
  log('Clone combat-boxe');
  run(`git clone --branch ${branch} "${cloneUrl()}" "${APP_DIR}"`);
} else {
  log('Mise a jour repo…');
  try {
    run(`git fetch origin && git reset --hard origin/${branch}`, APP_DIR);
  } catch {
    log('git pull ignore');
  }
}

if (fs.existsSync(ENV_FILE)) {
  fs.copyFileSync(ENV_FILE, path.join(APP_DIR, '.env'));
  log('.env copie vers l app');
}

run('npm install --omit=dev --no-fund --no-audit', APP_DIR);

log('Demarrage agent Combat Boxe…');
run('node scripts/serveur-production.mjs', APP_DIR);
