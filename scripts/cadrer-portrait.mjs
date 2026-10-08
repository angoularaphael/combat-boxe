/**
 * Recadre un portrait pour les cartes Combat Boxe.
 *
 * Fichier 640x800. Les cartes split sont en 4/5 par boxeur, object-position
 * en haut : on garde le haut du crâne, on coupe vers le bas si besoin.
 */
import { renameSync, unlinkSync, existsSync } from 'node:fs';
import sharp from 'sharp';

const W = 640;
const H = 800;

export async function bufferEstUnePhoto(buf) {
  if (!buf || buf.length < 6000) return false;
  try {
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height || meta.width < 180 || meta.height < 180) return false;
    const stats = await sharp(buf).stats();
    const avgStd = stats.channels.reduce((sum, ch) => sum + ch.stdev, 0) / stats.channels.length;
    if (avgStd < 18) return false;
    const sample = await sharp(buf).resize(48, 48, { fit: 'fill' }).removeAlpha().raw().toBuffer();
    let white = 0;
    const pixels = sample.length / 3;
    for (let i = 0; i < sample.length; i += 3) {
      if (sample[i] > 228 && sample[i + 1] > 228 && sample[i + 2] > 228) white += 1;
    }
    if (white / pixels > 0.38) return false;
    if (await bordsLaterauxBlancs(buf)) return false;
    return true;
  } catch {
    return false;
  }
}

function ratioClair(raw) {
  let light = 0;
  const pixels = raw.length / 3;
  for (let i = 0; i < raw.length; i += 3) {
    if (raw[i] > 214 && raw[i + 1] > 214 && raw[i + 2] > 214) light += 1;
  }
  return pixels ? light / pixels : 1;
}

/** Photo d'identite : les deux cotes sont un fond blanc, le visage remplit le cadre. */
export async function bordsLaterauxBlancs(input) {
  const meta = await sharp(input).rotate().metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (w < 80 || h < 80) return true;
  const band = Math.max(8, Math.round(w * 0.08));
  const left = await sharp(input)
    .rotate()
    .extract({ left: 0, top: 0, width: band, height: h })
    .resize(6, 24, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();
  const right = await sharp(input)
    .rotate()
    .extract({ left: w - band, top: 0, width: band, height: h })
    .resize(6, 24, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();
  return ratioClair(left) > 0.62 && ratioClair(right) > 0.62;
}

/** Plus le score est haut, plus la photo a un ring, un buste, une salle. Negatif : a jeter. */
export async function notePortrait(input) {
  if (await bordsLaterauxBlancs(input)) return -20;
  const meta = await sharp(input).rotate().metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  let score = h >= w ? 6 : -4;
  const stats = await sharp(input).stats();
  const avgStd = stats.channels.reduce((sum, ch) => sum + ch.stdev, 0) / Math.max(1, stats.channels.length);
  score += Math.min(8, avgStd / 8);
  if (Math.max(w, h) >= 1400) score += 3;
  return score;
}

export async function cadrerPortrait(filePath) {
  if (!existsSync(filePath)) return false;
  const tmp = `${filePath}.cadrage.tmp.jpg`;
  try {
    await sharp(filePath)
      .rotate()
      .resize(W, H, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(tmp);
    unlinkSync(filePath);
    const dest = filePath.replace(/\.(png|webp|jpeg)$/i, '.jpg');
    renameSync(tmp, dest);
    if (filePath !== dest && existsSync(filePath)) unlinkSync(filePath);
    return dest;
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.log('Cadrage ignore :', filePath, err.message);
    return false;
  }
}

export async function reduireAffiche(filePath) {
  if (!existsSync(filePath)) return false;
  const tmp = `${filePath}.affiche.tmp`;
  try {
    await sharp(filePath)
      .rotate()
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
      .toFile(tmp);
    unlinkSync(filePath);
    renameSync(tmp, filePath);
    return filePath;
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.log('Affiche ignoree :', filePath, err.message);
    return false;
  }
}
