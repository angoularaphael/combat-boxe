#!/usr/bin/env node
/**
 * Récupère l'image principale (og:image) de chaque source d'article et met à jour le frontmatter.
 *   node scripts/rattacher-photos-sources.mjs
 *   node scripts/rattacher-photos-sources.mjs --limit=20
 *   node scripts/rattacher-photos-sources.mjs --force
 */
import { rattacherPhotosArticles } from './images-editoriales.mjs';

const limit = Number.parseInt((process.argv.find((a) => a.startsWith('--limit=')) || '').slice(8), 10) || 0;
const force = process.argv.includes('--force');

const { scanned, updated } = await rattacherPhotosArticles({ limit, force });
console.log(`Termine : ${updated} images sur ${scanned} articles traites.`);
