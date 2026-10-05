# Configuration de l'IA éditoriale

## Ce qui est déjà configuré

La skill `redacteur-combat-boxe` est installée dans :

- `combat-boxe/.cursor/skills/redacteur-combat-boxe/SKILL.md`
- `.cursor/skills/redacteur-combat-boxe/SKILL.md`

Elle s'active dès qu'une demande concerne Combat Boxe : actualité, annonce de combat, résultat, calendrier, portrait, club, entraîneur ou guide.

Exemples de demandes dans Cursor :

```text
Publie un article sur le combat X contre Y.
```

```text
Vérifie les résultats boxe du week-end et publie les résultats confirmés.
```

```text
Mets à jour le calendrier Combat Boxe avec les galas français confirmés.
```

L'agent doit chercher les sources, rédiger le texte, ajouter les liens internes, renseigner les données du calendrier, lancer le build, puis publier.

## Publication

Le site est statique. La publication suit ce circuit :

1. L'agent écrit l'article dans `src/content/articles/`.
2. Il met `status: published`.
3. Il met à jour `src/data/entities.js` si le sujet touche au calendrier, aux résultats ou à une fiche.
4. Il exécute `npm run build`.
5. Il commit et pousse sur GitHub.
6. Vercel déploie automatiquement la branche liée au domaine `combat-boxe.com`.

Le dossier actuel n'est pas encore un dépôt Git. Tant que GitHub et Vercel ne sont pas reliés, l'agent peut créer les articles et vérifier le site, mais il ne peut pas les mettre en production sur le domaine.

## Publication programmée

Pour obtenir deux ou trois publications automatiques par semaine, créer une Cursor Automation une fois le dépôt GitHub connecté.

Plan recommandé :

- Lundi à 8 h : chercher les principales annonces et combats à venir, puis publier un article sourcé.
- Mercredi à 8 h : publier un portrait, un dossier ou un guide SEO.
- Dimanche à 20 h : vérifier les résultats du week-end, mettre à jour le calendrier et publier les comptes rendus confirmés.

Instructions à donner à chaque automation :

```text
Travaille dans le projet Combat Boxe. Applique la skill redacteur-combat-boxe.
Cherche des sources publiques identifiables. Ne reprends aucune phrase d'un
autre média. Utilise une photo officielle autorisée ou une photographie réelle
dont la licence permet la réutilisation et ajoute son crédit. Publie directement
le contenu sourcé, mets à jour les données associées, lance le build, commit et
pousse les modifications.
```

## Variables de production

Dans Vercel :

- `PUBLIC_GA_ID` : identifiant Google Analytics 4.
- `PUBLIC_GSC_VERIFICATION` : balise de vérification Search Console si cette méthode est choisie.

Le domaine, le dépôt GitHub et le projet Vercel doivent être connectés avant d'activer les publications programmées.
