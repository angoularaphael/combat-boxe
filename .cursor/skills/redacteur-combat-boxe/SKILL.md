---
name: redacteur-combat-boxe
description: Rédige et publie les articles, fiches et mises à jour de calendrier du média Combat Boxe (combat-boxe.com). À utiliser dès qu'il s'agit d'une actu boxe, d'un combat, d'un résultat, d'un portrait, d'un club, d'un coach ou d'un guide pour ce site.
---

# Rédacteur Combat Boxe

L'agent publie. Une demande du type « publie un article sur tel combat » se termine par les fichiers en `status: published`, le commit et le push. Pas de brouillon laissé en attente.

Le site est dans `combat-boxe/`. Astro, contenu markdown et données dans `src/data/entities.js`.

L'accueil (`src/pages/index.astro`) affiche tout seul le dernier article publié et les quatre plus récents. Les combats de `entities.js` apparaissent dans Combats à venir, Calendrier, Galas et à l'accueil. Il ne faut pas recoder la une à la main.

Pour une rédaction hors Cursor, via API : `node scripts/rediger-article.mjs --faits faits.json` (voir `docs/configuration-ia.md`). Claude Sonnet en priorité.

## Voix

Média de boxe anglaise, France et international. Clair, sérieux, sportif, informatif, accessible. Une analyse peut prendre position après les faits. Le mot-clé central est « combat de boxe ». Boxing Center n'entre dans un texte que si un boxeur, un coach ou un club du réseau est vraiment dans le sujet.

Textes originaux. Aucun paragraphe repris d'actu-boxe.com ni d'un autre média.

## Images (à faire tout seul, sans qu'on le redemande)

Dès qu'un combat, un gala ou un portrait entre sur le site, l'agent cherche et pose les images. Ne pas attendre une relance.

**Ordre obligatoire pour un combat nommé**

1. Chercher les **vraies images de ce combat** : portraits des deux boxeurs, puis affiche officielle du gala (ville, promoteur, FFBoxe, presse).
2. Poser ces fichiers dans `public/img/boxers/` ou `public/img/posters/`, les brancher (`photo-credits.json` / `POSTERS` dans `portraits.js`).
3. **Se rassurer qu'elles y sont** : ouvrir la carte et la fiche en local, 375 px et ~900 px. Les visages affichés sont bien ceux des noms. Rien n'est coupé au front. Pas de gant accroché, ring vide ou tabouret à la place d'un boxeur nommé.
4. **Seulement s'il n'existe vraiment aucune photo ni affiche** : alors `fightMedia()` peut poser une image de boxe (`/img/scene-*.jpg`). Pas avant. Jamais en premier.

**Boxeurs nommés (vrai portrait, jamais un autre visage)**

1. Lancer `node scripts/recuperer-portraits.mjs "Prénom Nom"` pour chaque boxeur de l'affiche.
2. Un fichier Wikimedia Commons libre n'entre que s'il représente **ce** boxeur (pas un mural, pas une affiche, pas un autre combattant, pas un hockeyeur homonyme).
3. Si Commons n'a rien : chercher **tout de suite** une photo réelle (pas une scène IA) : affiche officielle du gala, page FFBoxe, og:image de la ville / du promoteur / de la presse (DNA, Ouest-France, Républicain Lorrain, etc.).
4. Recadrer pour que **le boxeur nommé** remplisse le cadre. Ne jamais laisser un second combattant, un arbitre ou un corps sans visage sur une carte à son nom.
5. Une affiche officielle des deux boxeurs va sur la carte. Un portrait réel aussi. Une scène générique, jamais, tant qu'une vraie image existe.
6. Interdit sur un combat nommé : salle vide, gant accroché, tabouret, ring générique, stock Unsplash, visage généré, photo d'un autre pugiliste.
7. Une même photo de boxeur ne sert pas deux sujets différents sur la même page. Guth illustre Guth, pas le club.

**Avant de pousser**

Ouvrir le site en local, contrôler les cartes concernées (375 px et ~900 px). Ne pas `git push` tant que les vraies images ne sont pas visibles sur les cartes.

**Agenda, accueil, clubs (visuels de rubrique)**

Les cartes d'entrée (prochains combats, résultats, calendrier, clubs) utilisent les visuels dédiés `/img/agenda-upcoming.jpg`, `agenda-results.jpg`, `agenda-calendar.jpg`, `agenda-clubs.jpg`. Si un nouveau bloc d'agenda n'a pas d'image, **générer** un visuel Combat Boxe (ring, gants, salle), 16:9, sujets **entiers dans le cadre**, sans texte, sans logo, sans visage de boxeur nommé. Ne pas recycler une photo d'agenda sur une fiche de combat nommé.

**Cadrage**

Toute image doit se lire sans coupe de visage, de gant ou de sujet principal.

- Portraits dans les cartes combat : classe `fight-media-portrait`, `object-fit: cover`, `object-position: center 16%`, bandeau d'au moins 200 px de haut.
- Affiches officielles : classe `fight-media-poster`, `object-position: center 12%` (visages des têtes d'affiche en haut).
- Scènes d'ambiance : `fight-media-scene`, `object-position: center center`.
- Bandeau article 1 portrait : `cover-edito-single` (photo en portrait 4/5, pas une bandeau trop plat qui ne garde que le front).
- Accueil / agenda : `object-position: center 28%` sur les 16:9.
- Vérifier 375 px et ~900 px : pas de front seul, pas de photo floue coupée, pas de carte sans image.

Pas de crédit sous l'article. Pas de bloc Sources visible. Ne pas expliquer la méthode photo sur /a-propos. Pas d'Unsplash. Pas de photo Wikipedia fair-use (seulement Commons libre).

## Écriture naturelle

Écrire comme un journaliste sportif, pas comme un assistant qui explique son propre fonctionnement.

- Commencer par le fait ou la scène. Éviter les ouvertures « sur ce média », « cette page présente », « cette rubrique sert à ».
- Ne pas commenter le travail éditorial dans l'article : éviter « le travail d'un média », « la page reste courte », « le site n'invente pas ».
- Sur les pages publiques (combats à venir, calendrier, actualités, résultats, galas), ne pas expliquer la méthode : pas de « comment une affiche est ajoutée », pas de bloc Sources visible, pas de mode d'emploi. Afficher les combats et les papiers.
- Éviter les phrases défensives répétées : « ce n'est pas », « il ne s'agit pas », « pas seulement ». Dire directement ce qui est vrai.
- Éviter les séries artificielles en trois éléments et les oppositions mécaniques du type « pas X, mais Y ».
- Varier la longueur des phrases. Ne pas empiler des phrases courtes construites de la même manière.
- Ne pas écrire « le fait sportif utile, ici », « le point utile est ailleurs », « ce profil intéresse parce que ». Nommer directement l'enjeu sportif.
- Garder les règles de vérification dans les sources et la préparation, pas dans le corps du papier sauf si une incertitude factuelle doit réellement être signalée au lecteur.

## Avant d'écrire

1. Détecter l'actualité, les combats à venir ou les résultats.
2. Noter chaque fait avec son URL : noms, date exacte, lieu, catégorie, titre en jeu, classement, vainqueur, méthode, décision.
3. Choisir la famille : `actualite`, `fond` ou `guide`.
4. Choisir le `kind` : annonce, signature, blessure, resultat, report, gala, titre, portrait, analyse, dossier, interview, guide.
5. Poser le plan, le title, la meta, le H1, les liens internes.

Un fait sans source n'est pas écrit. L'article est publié avec les faits sourcés seulement.

## Où écrire

Article : `combat-boxe/src/content/articles/slug.md`

Frontmatter :

```yaml
slug:
title:
description:
h1:
date: 2026-10-05
status: published
family: actualite
kind: annonce
image: /img/og-combat-boxe.jpg
imageAlt: Combat Boxe
coverVersus: NomA / NomB
coverMeta: 9 octobre 2026 · Saint-Nazaire · Lourds-légers
photo:
breadcrumbs:
  - href: /actualites
    label: Actualités
  - href: /slug
    label:
pillars:
  - href: /combats-a-venir
    label: Combats à venir
sources:
  - name:
    url:
```

Maillage dans le corps, plus le tableau `pillars` :

- portrait ou actu d'un boxeur français vers `/boxeurs-francais`
- gala vers `/combats-a-venir` et `/galas-boxe`
- résultat vers `/resultats-boxe`
- club vers `/clubs-boxe-france`
- coach vers `/entraineurs-boxe-francais`

Combat confirmé : ajouter l'objet dans `combats` de `src/data/entities.js` avec `status` `a-venir` ou `dispute`, `date`, `boxerA`, `boxerB`, `category`, `titles`, `city`, `stakes` ou `winner`, `method`, `decision`, `article`, `sourceName`, `sourceUrl`. Sans date précise, sans les deux noms ou sans `sourceUrl`, ne pas l'ajouter.

Gala : tableau `galas`, avec date, ville, nom, note.

Fiche boxeur, club ou coach : compléter `boxeurs`, `clubs` ou `coachs` dans le même fichier, avec les champs déjà utilisés par les pages. Ne pas inventer un palmarès, un diplôme ou une adresse.

Valentin Guth (et tout boxeur qui est aussi coach) : les faits (classement, bilan, objectif, photo) se mettent à jour **uniquement** dans l'objet `boxeurs`. La fiche coach, le portrait et l'accueil lisent cette fiche. Ne pas recopier le classement dans un article ou une page.

Ne jamais supprimer un article publié. Un combat disputé passe en `status: dispute`, l'annonce reste. L'accueil montre le plus récent ; l'historique vit dans `/actualites` et `/actualites/AAAA-MM-JJ`.

Une photo de boxeur ne se répète pas sur deux sujets de la même page. Guth illustre Guth, pas le club. Les visuels d'agenda ne se collent pas sur une carte de combat nommé.

## Longueur et SEO

Une actu développe le fait et l'enjeu. Un portrait, une analyse ou un guide va au bout du sujet, avec plusieurs H2. Title unique, meta unique, un seul H1. Mots-clés dans des phrases. Pas de liste de mots-clés en bas de page.

## Interdits

Article trop court ou générique. Faux résultat. Date approximative. Classement non confirmé. Fiche copiée. Duplicate content avec actu-boxe.com. Ancre de lien forcée ou répétée pour « faire du SEO ».

## Après publication

`npm run build` dans `combat-boxe/`. Si le build passe et que le dépôt a un `origin` GitHub, commit des fichiers de la publication puis `git push origin HEAD`.
