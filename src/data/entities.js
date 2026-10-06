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
    objectif: 'une ceinture nationale en 2027',
    prochaines:
      "Disputer une ceinture nationale en 2027. Aucune date de gala n'est confirmée sur cette fiche.",
    photo: '/img/valentin-guth-hero.jpg',
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
      "Un boxeur formé au club est aujourd'hui professionnel et coach sur place. Classement, bilan et objectif sont ceux de sa fiche boxeur.",
    ambiance:
      "Le club met en avant un boxeur que les adhérents peuvent voir encore combattre, puis retrouver à l'entraînement. C'est cette continuité que la fiche retient.",
    pointsForts: [
      "Formation de boxeurs jusqu'au niveau professionnel",
      "Présence d'un boxeur professionnel encore en activité dans l'équipe d'encadrement",
      'Transmission : le pratiquant formé au club devient à son tour coach',
    ],
    url: 'https://boxe-toulouse.com/',
  },
];

const coachsRaw = [
  {
    slug: 'valentin-guth',
    boxeurSlug: 'valentin-guth',
    city: 'Toulouse',
    diplomes: ['BPJEPS mention Boxe', 'BPJEPS mention Sports de Contact'],
    diplomesSource: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    clubSlugs: ['boxing-center-toulouse-minimes'],
    boxeursFormes:
      "Le club le présente auprès des débutants, des loisirs, des enfants et des confirmés. La liste nominative des boxeurs qu'il a menés à un titre n'est pas publiée ici.",
    methode:
      "Une boxe vécue sur le ring, pas seulement expliquée. Il continue sa carrière professionnelle et s'en sert pour transmettre les exigences du combat aux adhérents.",
    role: 'Formation des pratiquants du club, des débutants aux confirmés, en parallèle de sa propre carrière.',
    parcours:
      "Formé comme boxeur au Boxing Center de Toulouse, passé professionnel, puis coach diplômé dans le même club. Le parcours sert d'exemple de transmission.",
    ficheUrl: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
  },
];

/** Fiches coach : nom, photo, classement et bilan viennent de la fiche boxeur du même slug. */
export const coachs = coachsRaw.map((coach) => {
  const boxeur = boxeurs.find((b) => b.slug === (coach.boxeurSlug || coach.slug));
  if (!boxeur) return coach;
  return {
    ...coach,
    name: boxeur.name,
    photo: boxeur.photo,
    photoAlt: `${boxeur.name}, coach de boxe anglaise à ${coach.city}`,
    resultats: boxeur.palmares,
    article: boxeur.article,
    ranking: boxeur.ranking,
    recordNote: boxeur.recordNote,
    prochaines: boxeur.prochaines,
    category: boxeur.category,
    objectif: boxeur.objectif,
  };
});

/** @type {Array<Record<string, string>>} */
export const combats = [
  {
    status: 'a-venir',
    date: '2026-10-08',
    boxerA: 'Osleys Iglesias',
    boxerB: 'Oliver Zaren',
    category: 'Super-moyens',
    titles: 'Championnats du monde IBF et IBO des super-moyens',
    city: 'Québec, Canada',
    stakes: 'Iglesias, 15-0 dont 14 arrêts, défend l’IBF pour la première fois face à Zaren, 19-0-1, au Capitole de Québec.',
    article: 'iglesias-zaren-quebec-super-moyens',
  },
  {
    status: 'a-venir',
    date: '2026-10-09',
    boxerA: 'Brice Clavier',
    boxerB: 'Gaëtan Ntambwe',
    category: 'Lourds-légers',
    titles: 'Championnat de France des lourds-légers',
    city: 'Saint-Nazaire',
    stakes: 'Clavier boxe à La Soucoupe pour le titre national, en dix rounds, devant le public du Boxing Nazairien.',
    article: 'clavier-ntambwe-saint-nazaire-lourds-legers',
  },
  {
    status: 'a-venir',
    date: '2026-10-10',
    boxerA: 'Marina Sakharov',
    boxerB: 'Isis Logerie',
    category: 'Super-plumes',
    titles: 'Championnat de France des super-plumes',
    city: 'Marlenheim',
    stakes: 'Titre national féminin au centre sportif Les Roseaux, combat principal annoncé à 21 heures.',
    article: 'sakharov-logerie-marlenheim-super-plumes',
  },
  {
    status: 'a-venir',
    date: '2026-10-10',
    boxerA: 'Hassana El Qadmi',
    boxerB: 'Luka Keinashvili',
    category: 'Super-moyens',
    titles: '',
    city: 'Marlenheim',
    stakes: 'Combat professionnel en lever de rideau du championnat de France féminin, Hassana El Qadmi étant annoncé champion de France.',
    article: 'sakharov-logerie-marlenheim-super-plumes',
  },
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
  },
  {
    status: 'a-venir',
    date: '2026-10-17',
    boxerA: 'Daniel Dubois',
    boxerB: 'Fabio Wardley',
    category: 'Poids lourds',
    titles: 'Championnat du monde WBO des poids lourds',
    city: 'Londres, Royaume-Uni',
    stakes: 'Revanche à l’O2 Arena. Dubois a pris le titre à Wardley le 9 mai à Manchester, arrêt au onzième round.',
    article: 'dubois-wardley-londres-poids-lourds',
  },
  {
    status: 'a-venir',
    date: '2026-10-17',
    boxerA: 'Sebastian Fundora',
    boxerB: 'Ermal Hadribeaj',
    category: 'Super-welters',
    titles: 'Championnat du monde WBC des super-welters',
    city: 'Carson, États-Unis',
    stakes: 'Fundora, champion WBC, défend sa ceinture contre Hadribeaj. Carte annoncée sur TNT.',
    article: 'fundora-hadribeaj-carson-super-welters',
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
  },
  {
    status: 'a-venir',
    date: '2026-10-24',
    boxerA: 'Dalton Smith',
    boxerB: 'Alberto Puello',
    category: 'Super-légers',
    titles: 'Championnat du monde WBC des super-légers',
    city: 'Sheffield, Royaume-Uni',
    stakes: 'Smith, champion WBC, défend sa ceinture contre Puello. Carte annoncée sur DAZN.',
    article: 'smith-puello-sheffield-super-legers',
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
  },
  {
    status: 'a-venir',
    date: '2026-10-31',
    boxerA: 'Makan Traoré',
    boxerB: 'Yamin Bartolo',
    category: 'Super-welters',
    titles: 'Championnat de France des super-welters',
    city: 'Royan',
    stakes: 'Traoré, du ROC Boxe, affronte le tenant du titre Bartolo à l’Espace Cordouan, en dix rounds de trois minutes.',
    article: 'traore-bartolo-royan-super-welters',
  },
  {
    status: 'a-venir',
    date: '2026-10-31',
    boxerA: 'Maloway Canlers',
    boxerB: 'Hadria Bader',
    category: 'Poids mouches',
    titles: 'Championnat de France des poids mouches',
    city: 'Royan',
    stakes: 'Canlers, du ROC Boxe, boxe Bader en huit rounds de deux minutes, sur la même soirée que Traoré contre Bartolo.',
    article: 'traore-bartolo-royan-super-welters',
  },
];

/** @type {Array<Record<string, string>>} */
export const galas = [
  {
    date: '2026-10-08',
    name: 'Iglesias contre Zaren',
    city: 'Québec, Capitole',
    note: 'Carte Eye of the Tiger. Affiche principale : titres IBF et IBO des super-moyens. Sur DAZN à l’international.',
  },
  {
    date: '2026-10-09',
    name: 'Championnat de France à Saint-Nazaire',
    city: 'Saint-Nazaire, La Soucoupe',
    note: 'Boxing Nazairien. Affiche principale : Clavier contre Ntambwe pour le titre de France des lourds-légers. Autres professionnels annoncés : Bartra, Gharroumi, Zozo.',
  },
  {
    date: '2026-10-10',
    name: 'Championnat de France à Marlenheim',
    city: 'Marlenheim, Les Roseaux',
    note: 'Boxing club de Marmoutier. Affiche principale : Sakharov contre Logerie pour le titre de France des super-plumes. Lever de rideau : El Qadmi contre Keinashvili.',
  },
  {
    date: '2026-10-10',
    name: 'Schofield contre Bahdi',
    city: 'Chicago, Wintrust Arena',
    note: 'Carte Golden Boy et Most Valuable Promotions, en direct sur DAZN. Affiche principale : titre WBA des poids légers.',
  },
  {
    date: '2026-10-17',
    name: 'La Nuit des Rois',
    city: 'Blois, gymnase Saint-Georges',
    note: 'Gala du Cercle Pugilistique Blésois : dix combats amateurs, deux professionnels. Ephrem Bariko remet le titre de France des poids moyens. Adversaire non nommé.',
  },
  {
    date: '2026-10-17',
    name: 'Dubois contre Wardley 2',
    city: 'Londres, O2 Arena',
    note: 'Revanche WBO des poids lourds. Dubois a pris le titre à Wardley le 9 mai à Manchester. Sur DAZN.',
  },
  {
    date: '2026-10-17',
    name: 'Fundora contre Hadribeaj',
    city: 'Carson, Californie',
    note: 'Défense du titre WBC des super-welters. Carte annoncée sur TNT.',
  },
  {
    date: '2026-10-24',
    name: 'Navarrete contre Foster',
    city: 'San Antonio, Frost Bank Center',
    note: 'Soirée Top Rank. Affiche principale : unification à trois ceintures chez les super-plumes.',
  },
  {
    date: '2026-10-24',
    name: 'Smith contre Puello',
    city: 'Sheffield',
    note: 'Défense du titre WBC des super-légers. Carte annoncée sur DAZN.',
  },
  {
    date: '2026-10-31',
    name: 'Mbilli contre Canelo',
    city: 'Riyad',
    note: 'Combat pour le titre WBC des super-moyens. Christian Mbilli, champion en titre, affronte Saúl Álvarez.',
  },
  {
    date: '2026-10-31',
    name: 'Royan Boxing Prestige',
    city: 'Royan, Espace Cordouan',
    note: 'Deux championnats de France : Traoré contre Bartolo chez les super-welters, Canlers contre Bader chez les mouches. Arthur Aslanian est annoncé, adversaire non nommé.',
  },
];

export function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date instanceof Date ? date : new Date(date));
}

/** Clé URL d'une édition : 2026-10-05, fuseau Paris. */
export function parisDayKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(
    date instanceof Date ? date : new Date(date),
  );
}

/** Titre, photo et faits d'un portrait : toujours ceux de la fiche boxeur. */
export function liveArticle(data) {
  const boxeur = boxeurs.find((b) => b.article === data.slug);
  if (!boxeur) return data;
  return {
    ...data,
    title: `${boxeur.name} vise ${boxeur.objectif} | Combat Boxe`,
    description: `${boxeur.name}, ${boxeur.ranking}. ${boxeur.recordNote} Objectif : ${boxeur.objectif}.`,
    h1: `${boxeur.name} : ${boxeur.ranking}, vise ${boxeur.objectif}`,
    photo: boxeur.photo,
    image: boxeur.photo,
    imageAlt: boxeur.photoAlt,
    boxeur,
  };
}

export function groupArticlesByDay(articles) {
  const map = new Map();
  for (const item of articles) {
    const key = parisDayKey(item.data.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
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
