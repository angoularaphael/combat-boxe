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
    return true;
  } catch {
    return false;
  }
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
