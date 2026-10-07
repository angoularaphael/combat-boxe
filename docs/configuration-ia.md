# Configuration de l'IA éditoriale

Le site en ligne : [https://combat-boxe.vercel.app/](https://combat-boxe.vercel.app/)

Le dépôt GitHub principal (`angoularaphael/combat-boxe`) est relié à Vercel. Quand l'agent pousse un article, un combat ou une photo sur `main`, Vercel déploie tout seul.

## Production : process BotHosting, pas GitHub Actions

Pas d'Actions sur le compte GitHub principal. Même schéma que BOXPLUS : un serveur BotHosting dédié, qui tourne tout seul, sans Cursor.

Fichiers à poser sur le panel :

- `/home/container/index.js` : copie de `deploy/bothosting/index.js`
- `/home/container/.env` : copie de `deploy/bothosting/.env.example` (rempli)
- Startup : `node index.js`

Le bootstrap clone le **dépôt principal**, installe les dépendances, puis lance `node scripts/serveur-production.mjs`.

Ce process :

1. Écoute le port du panel (BotHosting exige un process vivant).
2. Au démarrage, puis à 8 h et 20 h (heure de Paris), lance `scripts/agent-production.mjs`.
3. Lit des pages officielles (FFBoxe, WBC, promoteurs, presse).
4. Si un fait nouveau est sourcé : article markdown publié.
5. Combats / résultats / galas : JSON (`src/data/combats-auto.json`, `combats-updates.json`, `galas-auto.json`).
6. Photos réelles : Commons, puis pages promoteurs. Affiches dans `posters.json`. Cadrage 640x800 (`sharp`).
7. Commit au nom de Raphael et `git push` vers le dépôt principal. Vercel affiche.

### Secrets (uniquement sur le serveur, jamais dans Vercel ni dans git)

| Variable | Rôle |
| --- | --- |
| `ANTHROPIC_API_KEY` | Rédaction et calendrier. Sans elle, seules les photos partent. |
| `GIT_PUSH_TOKEN` | Jeton d'un **autre compte GitHub** (compte machine), avec droit d'écriture sur `angoularaphael/combat-boxe`. Le compte principal ne lance rien. |

Créer un PAT (fine-grained : Contents write sur ce dépôt, ou classic `repo` si le dépôt est privé) sur le compte machine, pas sur le compte Raphael.

Les clés IA ne vont **pas** dans Vercel : le site public n'appelle pas l'IA.

Lancer un tour à la main (même code) :

```bash
cd combat-boxe
node scripts/agent-production.mjs
```

Le process long :

```bash
node scripts/serveur-production.mjs
```

`npm start` appelle le process long. `npm run actu` et `npm run agent` font un seul tour, sans push.

## Rédaction ponctuelle à partir de faits

Pour un papier hors cron, `scripts/rediger-article.mjs` accepte une de ces clés, dans cet ordre :

| Variable | Modèle recommandé | Intérêt |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `claude-sonnet-4-5` | Meilleur choix éditorial |
| `OPENAI_API_KEY` | `gpt-4.1` | Solide, un peu plus générique |
| `GEMINI_API_KEY` | `gemini-2.5-pro` | Bon en français, souvent moins cher |

**À utiliser pour Combat Boxe : Claude Sonnet.**

Ne pas utiliser un modèle d'images. L'agent cherche une vraie photo du boxeur nommé (Commons, puis affiche / page promoteur). Une scène générique (`/img/scene-*.jpg`) seulement s'il n'existe vraiment aucune photo.

### Mise en place locale (optionnel)

1. Créer la clé sur [Anthropic](https://console.anthropic.com/).
2. Copier `.env.example` vers `.env` (jamais commité).
3. Coller `ANTHROPIC_API_KEY`.
4. Pour un article hors agent : `node scripts/rediger-article.mjs --faits faits.json`.

Sans `--faits`, `rediger-article.mjs` refuse de tourner.

## Publication

1. Article dans `src/content/articles/`, `status: published`.
2. Combats ajoutés par l'agent : `src/data/combats-auto.json` (pas besoin d'éditer `entities.js` à la main).
3. Photos : `public/img/boxers/` ou `public/img/posters/`, crédits dans `photo-credits.json` / `posters.json`.
4. Push sur `main` du dépôt principal.
5. Vercel met à jour [combat-boxe.vercel.app](https://combat-boxe.vercel.app/).

L'accueil prend tout seul le dernier article publié. Pas besoin de recoder la une.

## Variables de production (Vercel)

- `PUBLIC_GA_ID` : Google Analytics 4.
- `PUBLIC_GSC_VERIFICATION` : Search Console.

## Cursor

Cursor n'est plus le circuit de production. La skill `redacteur-combat-boxe` reste disponible pour un correctif ponctuel. Le calendrier, les articles et les photos partent du process BotHosting.

Ne pas afficher de bloc Sources ni de crédit photo sur le site.
