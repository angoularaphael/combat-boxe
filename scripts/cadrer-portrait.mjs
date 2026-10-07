/**
 * Recadre un portrait pour les cartes Combat Boxe.
 *
 * Apercu carte : bandeau 200 px de haut, largeur pleine (ou 2 colonnes en split).
 * Fichier portrait : 640 x 800. object-position 36 % aligne le visage dans
 * cette bande de 200 px. Un clipart ou une ceinture dessinee est refuse.
 */
import { renameSync, unlinkSync, existsSync } from 'node:fs';
import sharp from 'sharp';

function pipelineCadrage(filePath) {
  return sharp(filePath).rotate().resize(640, 800, { fit: 'cover', position: 'attention' });
}

export async function bufferEstUnePhoto(buf) {
  if (!buf || buf.length < 6000) return false;
  try {
    const img = sharp(buf);
    const meta = await img.metadata();
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
