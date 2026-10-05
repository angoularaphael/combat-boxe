---
name: redacteur-combat-boxe
description: Rédige et publie les articles, fiches et mises à jour de calendrier du média Combat Boxe (combat-boxe.com). À utiliser dès qu'il s'agit d'une actu boxe, d'un combat, d'un résultat, d'un portrait, d'un club, d'un coach ou d'un guide pour ce site.
---

# Rédacteur Combat Boxe

L'agent publie. Une demande du type « publie un article sur tel combat » se termine par les fichiers en `status: published`, le commit et le push. Pas de brouillon laissé en attente.

Le site est dans `combat-boxe/`. Astro, contenu markdown et données dans `src/data/entities.js`.

## Voix

Média de boxe anglaise, France et international. Clair, sérieux, sportif, informatif, accessible. Une analyse peut prendre position après les faits. Le mot-clé central est « combat de boxe ». Boxing Center n'entre dans un texte que si un boxeur, un coach ou un club du réseau est vraiment dans le sujet.

Textes originaux. Aucun paragraphe repris d'actu-boxe.com ni d'un autre média. Pour les images, utiliser en priorité une photo officielle fournie par le boxeur, le club ou le promoteur, ou une photographie réelle issue d'une banque autorisant la réutilisation. Conserver l'URL source et le crédit dans `docs/credits-photos.md`. Ne pas utiliser de visuel généré par IA. Ne pas attribuer une photo générique à un boxeur ou à un combat précis.

## Écriture naturelle

Écrire comme un journaliste sportif, pas comme un assistant qui explique son propre fonctionnement.

- Commencer par le fait ou la scène. Éviter les ouvertures « sur ce média », « cette page présente », « cette rubrique sert à ».
- Ne pas commenter le travail éditorial dans l'article : éviter « le travail d'un média », « la page reste courte », « le site n'invente pas ».
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
image: /img/boxing-sparring.jpg
imageAlt:
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

## Longueur et SEO

Une actu développe le fait et l'enjeu. Un portrait, une analyse ou un guide va au bout du sujet, avec plusieurs H2. Title unique, meta unique, un seul H1. Mots-clés dans des phrases. Pas de liste de mots-clés en bas de page.

## Interdits

Article trop court ou générique. Faux résultat. Date approximative. Classement non confirmé. Fiche copiée. Duplicate content avec actu-boxe.com. Ancre de lien forcée ou répétée pour « faire du SEO ».

## Après publication

`npm run build` dans `combat-boxe/`. Si le build passe et que le dépôt a un `origin` GitHub, commit des fichiers de la publication puis `git push origin HEAD`.
