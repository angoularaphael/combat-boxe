# Configuration de l'IA éditoriale

Le site en ligne : [https://combat-boxe.vercel.app/](https://combat-boxe.vercel.app/)

Le dépôt GitHub est relié à Vercel. Un article en `status: published`, poussé sur `main`, apparaît tout seul à l'accueil, dans Actualités, et dans Combats / Galas / Calendrier si `src/data/entities.js` est mis à jour.

## 1. La voie la plus simple : Cursor + la skill

La skill `redacteur-combat-boxe` est déjà dans le projet. Dans Cursor, il suffit d'écrire par exemple :

```text
Publie un article sourcé sur Mbilli contre Canelo.
```

```text
Vérifie les combats de boxe de la semaine et mets à jour le calendrier Combat Boxe.
```

L'agent cherche les sources, rédige, enregistre le markdown, met à jour les données, lance le build, commit et pousse. Vercel déploie.

Ce circuit n'a pas besoin d'une clé API : c'est l'agent Cursor qui écrit.

## 2. La voie API : rédiger un article à partir d'infos

Pour produire des blogs à partir d'un fichier de faits (sans laisser l'IA inventer), utiliser le script `scripts/rediger-article.mjs`.

Il accepte une de ces clés, dans cet ordre :

| Variable | Modèle recommandé | Intérêt |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `claude-sonnet-4-5` | Meilleur choix éditorial : suit la voix, reste factuel, français soigné |
| `OPENAI_API_KEY` | `gpt-4.1` | Solide, un peu plus générique |
| `GEMINI_API_KEY` | `gemini-2.5-pro` | Bon en français, contexte large, souvent moins cher |

**À utiliser pour Combat Boxe : Claude Sonnet.** C'est le modèle le plus fiable pour un média : il copie moins, il hallucine moins sur les records, il tient un ton de journaliste sportif.

Ne pas utiliser un modèle d'images (Dall-E, Midjourney, Firefly). Les visuels du site sont des photos réelles.

### Mise en place

1. Créer la clé sur [Anthropic](https://console.anthropic.com/), [OpenAI](https://platform.openai.com/api-keys) ou [Google AI Studio](https://aistudio.google.com/apikey).
2. Copier `.env.example` vers `.env` (jamais commité) et coller la clé.
3. Préparer un JSON de faits, par exemple `faits.json` :

```json
{
  "slug": "exemple-combat",
  "kind": "annonce",
  "family": "actualite",
  "date": "2026-10-05",
  "image": "/img/boxing-gloves.jpg",
  "imageAlt": "Gants de boxe posés au bord d'un ring",
  "title": "Titre SEO, moins de 65 caractères",
  "h1": "Titre de l'article",
  "description": "Meta description",
  "pillars": [
    { "href": "/combats-a-venir", "label": "Combats à venir" }
  ],
  "faits": [
    "Date du combat : 31 octobre 2026 à Riyad",
    "Ceinture : titre WBC des super-moyens",
    "Champion : Christian Mbilli, 29-0-1 (24 KO) selon le WBC"
  ],
  "sources": [
    { "name": "World Boxing Council", "url": "https://wbcboxing.com/en/canelo-vs-mbilli-wbc-super-middleweight-world-title-on-the-line-october-31/" }
  ]
}
```

4. Lancer :

```bash
cd combat-boxe
node scripts/rediger-article.mjs --faits faits.json
```

Le script écrit `src/content/articles/slug.md` en `status: published`. Relire, puis `npm run build`, commit et push. Vercel affiche l'article.

Sans `--faits`, le script refuse de tourner : pas de texte à partir du vide.

## Publication

1. Article dans `src/content/articles/`.
2. `status: published`.
3. Calendrier, résultats ou fiche : `src/data/entities.js`.
4. `npm run build`.
5. Commit et push sur `main`.
6. Vercel met à jour [combat-boxe.vercel.app](https://combat-boxe.vercel.app/).

L'accueil prend tout seul le dernier article publié. Le fil « L'essentiel du ring » aussi. Pas besoin de recoder la une.

## Variables de production (Vercel)

- `PUBLIC_GA_ID` : Google Analytics 4.
- `PUBLIC_GSC_VERIFICATION` : Search Console.

Les clés `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` et `GEMINI_API_KEY` restent en local (ou dans un outil d'automation). Elles ne vont pas dans Vercel : le site est statique, il n'appelle pas l'IA au moment de la visite.

## Publication programmée

Une fois le dépôt GitHub connecté, une Cursor Automation peut tourner :

- Lundi 8 h : annonces et combats à venir.
- Mercredi 8 h : portrait, dossier ou guide.
- Dimanche 20 h : résultats du week-end.

Prompt type :

```text
Travaille dans le projet Combat Boxe. Applique la skill redacteur-combat-boxe.
Cherche des sources publiques identifiables. Ne reprends aucune phrase d'un
autre média. Utilise une photo réelle autorisée. Publie le contenu sourcé,
mets à jour entities.js, lance le build, commit et pousse.
```
