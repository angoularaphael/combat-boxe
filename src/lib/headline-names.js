const HEADLINE_STOP =
  /\s+(?:quitte|bat|affronte|contre|remporte|signe|annonce|défend|defend|perd|gagne|arrête|arrete|obtient|rejoint|laisse|sign|announces|defends|wins|loses|leaves)\b/i;

/** Extrait un nom propre en tete de titre (article sans coverVersus). */
export function namesFromHeadline(h1) {
  if (!h1) return [];
  const chunk = String(h1)
    .split(HEADLINE_STOP)[0]
    .replace(/\s*[|:–-].*$/, '')
    .trim();
  const m = chunk.match(/^([A-ZÀ-ÖØÆ][\wÀ-ÿ''-]+(?:\s+[A-ZÀ-ÖØÆ][\wÀ-ÿ''-]+){0,2})/);
  return m ? [m[1].trim()] : [];
}
