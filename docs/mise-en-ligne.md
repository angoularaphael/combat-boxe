# Mise en ligne de combat-boxe.com

## Vercel

1. Créer un projet Vercel pointé sur le dossier `combat-boxe` (racine du projet Astro).
2. Framework : Astro. Commande de build : `npm run build`.
3. Ajouter le domaine `combat-boxe.com` et le `www` si besoin, puis suivre les DNS indiqués par Vercel (enregistrements A ou CNAME).

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

Production actuelle : https://combat-boxe.vercel.app/

## Agent éditorial (BotHosting)

Le site public reste sur Vercel. L'agent qui rédige et pose les photos tourne sur un serveur BotHosting, comme BOXPLUS, **sans GitHub Actions** sur le compte principal.

Voir `docs/configuration-ia.md` et `deploy/bothosting/`.
