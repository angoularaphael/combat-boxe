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
    image: '/img/boxing-sparring.jpg',
    imageAlt: 'Deux boxeurs en séance de sparring dans une salle',
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
export const combats = [];

/** @type {Array<Record<string, string>>} */
export const galas = [];

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
