# Mise en ligne de combat-boxe.com

## Vercel

Le dépôt est [boxing-center/combat-boxe](https://github.com/boxing-center/combat-boxe). Chaque push sur `main` doit déployer seul.

1. Sur vercel.com, compte qui doit posséder le site : Add New, Project.
2. Import Git Repository. Si `boxing-center` n'apparaît pas : Adjust GitHub App Permissions, puis autoriser l'organisation `boxing-center` et le dépôt `combat-boxe`.
3. Framework : Astro. Racine du dépôt (le projet Astro est à la racine, pas dans un sous-dossier). Build : `npm run build`. Branche de production : `main`.
4. Deploy. Puis Settings, Domains : ajouter `combat-boxe.com`. Si le domaine est encore sur l'ancien projet, le retirer là-bas avant, sinon Vercel le refuse.
5. Au bureau d'enregistrement, poser les DNS indiqués par Vercel.

Après ça, le push du matin (BotHosting) déclenche le déploiement. Plus de redeploy à la main.

Les variables déjà utilisées, si elles existaient sur l'ancien projet : `PUBLIC_GA_ID`, `PUBLIC_GSC_VERIFICATION`. Les recopier telles quelles. Sans elles, le site se construit quand même.

## Google Analytics 4

1. Créer une propriété GA4 pour combat-boxe.com.
2. Copier l'identifiant de mesure (`G-...`).
3. Le poser dans les variables d'environnement Vercel : `PUBLIC_GA_ID`.
4. Redéployer. Sans cette variable, aucune balise n'est chargée.

## Google Search Console

1. Ajouter la propriété de domaine `combat-boxe.com` (vérification DNS) ou la propriété préfixe URL.
2. Si la vérification se fait par balise meta, poser le code dans `PUBLIC_GSC_VERIFICATION` et redéployer.
3. Envoyer le sitemap : `https://combat-boxe.com/sitemap.xml`.
4. Demander l'indexation de l'accueil, de `/combat-de-boxe`, de `/combats-a-venir`, de `/resultats-boxe` et de l'article Valentin Guth.

## Local

```
cd combat-boxe
npm install
npm run dev
```

Le site répond sur le port 3310.

Production actuelle : https://combat-boxe.com/

## Agent éditorial (BotHosting)

Le site public reste sur Vercel. L'agent qui rédige et pose les photos tourne sur un serveur BotHosting, comme BOXPLUS, **sans GitHub Actions** sur le compte principal.

Voir `docs/configuration-ia.md` et `deploy/bothosting/`.
