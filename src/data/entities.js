/** Fiches et combats publiés. Un combat n'entre ici que s'il a une date, des noms et une source. */

export const boxeurs = [
  {
    slug: 'valentin-guth',
    name: 'Valentin Guth',
    country: 'France',
    international: false,
    category: 'Super-coqs',
    ranking: 'n°3 français chez les super-coqs',
    rankingSource: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    recordNote:
      'Le club indique 46 combats amateurs, 5 combats professionnels et 1 défaite chez les professionnels.',
    clubSlug: 'boxing-center-toulouse-minimes',
    coachSlug: 'valentin-guth',
    style:
      "Boxeur de ring formé au club, encore en activité chez les professionnels, qui transmet ensuite ce qu'il pratique.",
    parcours:
      'Valentin Guth a été formé comme boxeur au Boxing Center de Toulouse. Il est passé des rangs amateurs au niveau professionnel et reste engagé sur le ring tout en coachant les adhérents.',
    palmares:
      "Classement annoncé par Boxing Center : n°3 français chez les super-coqs. Aucune ceinture nationale n'est indiquée à ce stade. L'objectif annoncé est d'en disputer une en 2027.",
    combatsMarquants:
      "Le passage du ring amateur au ring professionnel, au sein du club qui l'a formé. Le détail combat par combat n'est pas repris ici lorsque les bilans publics ne concordent pas.",
    prochaines:
      "Disputer une ceinture nationale en 2027. Aucune date de gala n'est confirmée sur cette fiche.",
    photo: '/img/valentin-guth.jpg',
    photoAlt: 'Valentin Guth, boxeur professionnel français chez les super-coqs',
    article: 'valentin-guth-boxeur-super-coq',
  },
];

export const clubs = [
  {
    slug: 'boxing-center-toulouse-minimes',
    name: 'Boxing Center Toulouse Minimes',
    city: 'Toulouse',
    address: '12 rue de Fenouillet, 31200 Toulouse',
    addressSource: 'https://boxingcenter.fr/salle-de-sport-toulouse/salle-de-boxe-toulouse-minimes/',
    disciplines: ['Boxe anglaise'],
    coachSlugs: ['valentin-guth'],
    histoire:
      "Salle de boxe anglaise à Toulouse, dans le quartier des Minimes. Le club forme des pratiquants et a accompagné Valentin Guth des rangs amateurs jusqu'au professionnalisme.",
    boxeursFormes: ['valentin-guth'],
    resultats:
      "Le résultat retenu ici est un parcours : un boxeur formé au club est aujourd'hui professionnel, classé n°3 français chez les super-coqs selon Boxing Center, et coach sur place.",
    ambiance:
      "Le club met en avant un boxeur que les adhérents peuvent voir encore combattre, puis retrouver à l'entraînement. C'est cette continuité que la fiche retient.",
    pointsForts: [
      "Formation de boxeurs jusqu'au niveau professionnel",
      "Présence d'un boxeur professionnel encore en activité dans l'équipe d'encadrement",
      'Transmission : le pratiquant formé au club devient à son tour coach',
    ],
    url: 'https://boxe-toulouse.com/',
    image: '/img/valentin-guth-hero.jpg',
    imageAlt: 'Valentin Guth au Boxing Center de Toulouse Minimes',
  },
];

export const coachs = [
  {
    slug: 'valentin-guth',
    name: 'Valentin Guth',
    city: 'Toulouse',
    diplomes: ['BPJEPS mention Boxe', 'BPJEPS mention Sports de Contact'],
    diplomesSource: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    clubSlugs: ['boxing-center-toulouse-minimes'],
    boxeursFormes:
      "Le club le présente auprès des débutants, des loisirs, des enfants et des confirmés. La liste nominative des boxeurs qu'il a menés à un titre n'est pas publiée ici.",
    methode:
      "Une boxe vécue sur le ring, pas seulement expliquée. Il continue sa carrière professionnelle et s'en sert pour transmettre les exigences du combat aux adhérents.",
    resultats:
      "Boxeur professionnel classé n°3 français chez les super-coqs selon Boxing Center, avec l'objectif annoncé d'une ceinture nationale en 2027.",
    role: 'Formation des pratiquants du club, des débutants aux confirmés, en parallèle de sa propre carrière.',
    parcours:
      "Formé comme boxeur au Boxing Center de Toulouse, passé professionnel, puis coach diplômé dans le même club. Le parcours sert d'exemple de transmission.",
    photo: '/img/valentin-guth.jpg',
    photoAlt: 'Valentin Guth, coach de boxe anglaise à Toulouse',
    ficheUrl: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    article: 'valentin-guth-boxeur-super-coq',
  },
];

/** @type {Array<Record<string, string>>} */
export const combats = [
  {
    status: 'a-venir',
    date: '2026-10-10',
    boxerA: 'Floyd Schofield III',
    boxerB: 'Lucas Bahdi',
    category: 'Poids légers',
    titles: 'Championnat du monde WBA des poids légers',
    city: 'Chicago, États-Unis',
    stakes:
      'Deux invaincus se disputent la ceinture WBA des poids légers à la Wintrust Arena, en coproduction Golden Boy et Most Valuable Promotions, sur DAZN.',
    article: 'schofield-bahdi-chicago-poids-legers',
    sourceName: 'Most Valuable Promotions',
    sourceUrl: 'https://www.mostvaluablepromotions.com/schofield-vs-bahdi-undercard-set-for-oct-10-in-chicago/',
  },
  {
    status: 'a-venir',
    date: '2026-10-24',
    boxerA: 'Emanuel Navarrete',
    boxerB: "O'Shaquie Foster",
    category: 'Super-plumes',
    titles: 'Unification WBO, IBF et WBC des super-plumes',
    city: 'San Antonio, États-Unis',
    stakes:
      'Le champion WBO/IBF Emanuel Navarrete affronte le champion WBC O’Shaquie Foster pour trois ceintures mondiales au Frost Bank Center.',
    article: 'navarrete-foster-unification-super-plumes',
    sourceName: 'Top Rank Boxing',
    sourceUrl: 'https://toprank.com/events/navarrete-vs-foster',
  },
  {
    status: 'a-venir',
    date: '2026-10-31',
    boxerA: 'Christian Mbilli',
    boxerB: 'Saúl Álvarez',
    category: 'Super-moyens',
    titles: 'Championnat du monde WBC des super-moyens',
    city: 'Riyad, Arabie saoudite',
    stakes:
      'Mbilli, champion WBC, défend sa ceinture face à Canelo Álvarez, qui revient chercher le titre mondial des super-moyens.',
    article: 'mbilli-canelo-riyad-super-moyens',
    sourceName: 'World Boxing Council',
    sourceUrl: 'https://wbcboxing.com/en/canelo-vs-mbilli-wbc-super-middleweight-world-title-on-the-line-october-31/',
  },
];

/** @type {Array<Record<string, string>>} */
export const galas = [
  {
    date: '2026-10-10',
    name: 'Schofield contre Bahdi',
    city: 'Chicago, Wintrust Arena',
    note: 'Carte Golden Boy et Most Valuable Promotions, en direct sur DAZN. Affiche principale : titre WBA des poids légers. En co-main, Ricardo Sandoval défend ses ceintures WBA et WBC contre Sergio Mendoza.',
  },
  {
    date: '2026-10-24',
    name: 'Navarrete contre Foster',
    city: 'San Antonio, Frost Bank Center',
    note: 'Soirée Top Rank. Affiche principale : unification à trois ceintures chez les super-plumes. Co-feature : Albert Gonzalez contre Edward Vazquez en plumes.',
  },
  {
    date: '2026-10-31',
    name: 'Mbilli contre Canelo',
    city: 'Riyad',
    note: 'Combat pour le titre WBC des super-moyens. Christian Mbilli, champion en titre, affronte Saúl Álvarez. Annonce du WBC le 30 septembre 2026.',
  },
];

export function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date instanceof Date ? date : new Date(date));
}

export function boxeurBySlug(slug) {
  return boxeurs.find((b) => b.slug === slug);
}

export function clubBySlug(slug) {
  return clubs.find((c) => c.slug === slug);
}

export function coachBySlug(slug) {
  return coachs.find((c) => c.slug === slug);
}

export function kindLabel(kind) {
  const labels = {
    portrait: 'Portrait',
    annonce: 'Annonce',
    resultat: 'Résultat',
    analyse: 'Analyse',
    interview: 'Interview',
    dossier: 'Dossier',
    guide: 'Guide',
    gala: 'Gala',
    titre: 'Titre',
    signature: 'Signature',
    blessure: 'Blessure',
    report: 'Report',
  };
  return labels[kind] || kind;
}
