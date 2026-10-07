/**
 * Recadre un portrait pour les cartes et bandeaux Combat Boxe : 640x800, visage dans le cadre.
 */
import { renameSync, unlinkSync, existsSync } from 'node:fs';
import sharp from 'sharp';

function pipelineCadrage(filePath) {
  return sharp(filePath).rotate().resize(640, 800, { fit: 'cover', position: 'attention' });
}

export async function cadrerPortrait(filePath) {
  if (!existsSync(filePath)) return false;
  const ext = (filePath.split('.').pop() || 'jpg').toLowerCase();
  const tmp = `${filePath}.cadrage.tmp`;
  try {
    let img = pipelineCadrage(filePath);
    if (ext === 'png') img = img.png({ quality: 90 });
    else if (ext === 'webp') img = img.webp({ quality: 88 });
    else img = img.jpeg({ quality: 88, mozjpeg: true });
    await img.toFile(tmp);
    unlinkSync(filePath);
    renameSync(tmp, filePath);
    return filePath;
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
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
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

export async function bufferEstUnePhoto(buf) {
  if (!buf || buf.length < 6000) return false;
  try {
    const meta = await sharp(buf).metadata();
    return Boolean(meta.width && meta.height && meta.width >= 180 && meta.height >= 180);
  } catch {
    return false;
  }
}
