/**
 * Ramene les photos publiees a la taille d'affichage.
 * Portraits : 640x800. Affiches et scenes : largeur plafonnee.
 */
import { readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { cadrerPortrait } from './cadrer-portrait.mjs';

const imgRoot = fileURLToPath(new URL('../public/img/', import.meta.url));
const creditsPath = fileURLToPath(new URL('../src/data/photo-credits.json', import.meta.url));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

function webPath(abs) {
  return `/img/${relative(imgRoot, abs).replace(/\\/g, '/')}`;
}

async function reduire(abs, width, quality) {
  const before = statSync(abs).size;
  const tmp = `${abs}.light.tmp`;
  await sharp(abs).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(tmp);
  unlinkSync(abs);
  renameSync(tmp, abs);
  return [before, statSync(abs).size];
}

const credits = JSON.parse(readFileSync(creditsPath, 'utf8'));
const files = walk(imgRoot);
let saved = 0;

for (const abs of files) {
  const rel = abs.replace(/\\/g, '/');
  if (/logo|favicon/i.test(rel)) continue;
  const size = statSync(abs).size;
  const isBoxer = rel.includes('/boxers/');
  const isPoster = rel.includes('/posters/');
  const heavy = size > 140 * 1024;
  const png = /\.png$/i.test(abs);
  if (!isBoxer && !isPoster && !heavy) continue;
  if (isBoxer && !png && size < 100 * 1024) continue;
  if (isPoster && size < 160 * 1024) continue;

  const beforeWeb = webPath(abs);
  let after = abs;
  let before = size;
  let afterSize = size;
  if (isBoxer) {
    const dest = await cadrerPortrait(abs);
    if (!dest) continue;
    after = dest;
    afterSize = statSync(dest).size;
  } else {
    const width = isPoster ? 1000 : 1200;
    const quality = isPoster ? 76 : 74;
    [before, afterSize] = await reduire(abs, width, quality);
  }
  saved += before - afterSize;
  const afterWeb = webPath(after);
  if (beforeWeb !== afterWeb) {
    for (const row of credits) {
      if (row.path === beforeWeb) row.path = afterWeb;
    }
  }
  console.log(`${Math.round(before / 1024)} -> ${Math.round(afterSize / 1024)} KB  ${afterWeb}`);
}

writeFileSync(creditsPath, `${JSON.stringify(credits, null, 2)}\n`);
console.log(`Gain ${Math.round(saved / 1024)} KB`);
