/** Fiches et combats publiés. Un combat n'entre ici que s'il a une date, des noms et une source. */
import { countryCodeFromCity, slugifyName } from '../lib/flags.js';
import combatsAuto from './combats-auto.json';
import galasAuto from './galas-auto.json';
import combatsUpdates from './combats-updates.json';
import { lectures } from './lectures.js';

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
    record: '5 combats pro, 1 défaite',
    gym: 'Boxing Center Minimes, Toulouse',
    verified: 'Fiche du 8 octobre 2026',
    photoSource: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    photoSourceLabel: 'Boxing Center',
  },
  {
    slug: 'christian-mbilli',
    name: 'Christian Mbilli',
    country: 'Cameroun et Canada',
    international: true,
    category: 'Super-moyens',
    ranking: 'champion WBC des super-moyens',
    rankingSource: 'https://wbcboxing.com/en/canelo-vs-mbilli-wbc-super-middleweight-world-title-on-the-line-october-31/',
    record: '29-0-1',
    recordNote: 'Le WBC le donne à 29 victoires, aucune défaite, un match nul, dont 24 arrêts.',
    gym: 'Montréal',
    verified: 'Fiche du 8 octobre 2026',
    style: 'Champion en titre, qui a pris la ceinture intérimaire en arrêtant Maciej Sulecki au premier round.',
    parcours:
      "Mbilli boxe sous les couleurs du Cameroun et du Canada. Il s'entraîne à Montréal. Le WBC a confirmé sa défense contre Saúl Álvarez le 30 septembre 2026.",
    palmares:
      '29 victoires, aucune défaite, un match nul, dont 24 arrêts, selon le WBC. Ceinture intérimaire en juin 2025, puis titre mondial.',
    combatsMarquants:
      'Arrêt de Maciej Sulecki au premier round pour la ceinture intérimaire. Match nul contre Lester Martínez, classé combat de l’année 2025 par le WBC.',
    objectif: 'une première défense contre Saúl Álvarez',
    prochaines: 'Défendre le titre WBC des super-moyens le 31 octobre 2026 à Riyad.',
    photo: '/img/boxers/christian-mbilli.jpg',
    photoAlt: 'Christian Mbilli, gants rouges, maillot de l’équipe de France amateur',
    article: 'christian-mbilli',
  },
  {
    slug: 'anthony-joshua',
    name: 'Anthony Joshua',
    country: 'Royaume-Uni',
    international: true,
    category: 'Poids lourds',
    ranking: 'ancien champion du monde des poids lourds',
    rankingSource: 'https://www.principalitystadium.wales/event/tyson-fury-v-anthony-joshua/',
    recordNote: 'La page du Principality Stadium ne publie pas le bilan combat par combat.',
    verified: 'Fiche du 8 octobre 2026',
    style: 'Poids lourd britannique présenté par la salle comme un ancien détenteur de titres mondiaux.',
    parcours:
      'Le Principality Stadium le présente parmi les poids lourds britanniques qui ont dominé la catégorie pendant plus d’une décennie et détenu des titres mondiaux.',
    palmares: 'Le détail combat par combat n’est pas publié sur la page de la salle.',
    combatsMarquants:
      'Il n’a jamais affronté Tyson Fury chez les professionnels, selon la présentation du Principality Stadium.',
    objectif: 'le combat contre Tyson Fury à Cardiff',
    prochaines: 'Affronter Tyson Fury le 11 décembre 2026 au Principality Stadium, en direct sur Netflix.',
    photo: '/img/boxers/anthony-joshua.jpg',
    photoAlt: 'Anthony Joshua en conférence de presse',
    article: 'anthony-joshua',
  },
  {
    slug: 'tyson-fury',
    name: 'Tyson Fury',
    country: 'Royaume-Uni',
    international: true,
    category: 'Poids lourds',
    ranking: 'ancien champion du monde des poids lourds',
    rankingSource: 'https://www.principalitystadium.wales/event/tyson-fury-v-anthony-joshua/',
    recordNote: 'La page du Principality Stadium ne publie pas le bilan combat par combat.',
    verified: 'Fiche du 8 octobre 2026',
    style: 'Poids lourd britannique présenté par la salle comme un ancien détenteur de titres mondiaux.',
    parcours:
      'Le Principality Stadium le présente parmi les poids lourds britanniques qui ont dominé la catégorie pendant plus d’une décennie et détenu des titres mondiaux.',
    palmares: 'Le détail combat par combat n’est pas publié sur la page de la salle.',
    combatsMarquants:
      'Il n’a jamais affronté Anthony Joshua chez les professionnels, selon la présentation du Principality Stadium.',
    objectif: 'le combat contre Anthony Joshua à Cardiff',
    prochaines: 'Affronter Anthony Joshua le 11 décembre 2026 au Principality Stadium, en direct sur Netflix.',
    photo: '/img/boxers/tyson-fury.jpg',
    photoAlt: 'Tyson Fury en costume, au bord d’un ring',
    article: 'tyson-fury',
  },
];

export const clubs = [
  {
    slug: 'toulouse-minimes-boxing-club',
    name: 'Toulouse Minimes Boxing Club',
    city: 'Toulouse',
    address: '10 rue de Fenouillet, 31200 Toulouse',
    addressSource: 'https://toulouse-minimes-boxing-club.fr/',
    disciplines: ['Boxe anglaise'],
    coachSlugs: [],
    histoire:
      "Club de boxe anglaise aux Minimes, à la Barrière de Paris. Le site du TMBC indique le 10 rue de Fenouillet, avec des cours loisirs, compétiteurs et une école.",
    boxeursFormes: [],
    resultats:
      "Le club présente ses cours et son ring sur toulouse-minimes-boxing-club.fr. Les bilans nominatifs ne sont pas repris ici.",
    ambiance:
      "Le ring porte le mur TMBC, Toulouse Minimes Boxing Club, sous les drapeaux de la salle.",
    pointsForts: [
      'Boxe anglaise',
      'Cours loisirs, compétiteurs et école',
      '10 rue de Fenouillet, métro Barrière de Paris',
    ],
    url: 'https://toulouse-minimes-boxing-club.fr/',
    urlLabel: 'Toulouse Minimes Boxing Club',
    image: '/img/tmbc-ring.jpg',
    imageAlt: 'Ring du Toulouse Minimes Boxing Club, mur TMBC au 10 rue de Fenouillet',
  },
  {
    slug: 'boxing-center-toulouse-minimes',
    name: 'Boxing Center Minimes',
    city: 'Toulouse',
    address: '12 rue de Fenouillet, 31200 Toulouse',
    addressSource: 'https://boxe-toulouse.com/',
    disciplines: ['Boxe anglaise'],
    coachSlugs: ['valentin-guth'],
    histoire:
      "Salle Boxing Center au 12 rue de Fenouillet, présentée sur boxe-toulouse.com. Le club forme des pratiquants et a accompagné Valentin Guth des rangs amateurs jusqu'au professionnalisme.",
    boxeursFormes: ['valentin-guth'],
    resultats:
      "Un boxeur formé au club est aujourd'hui professionnel et coach sur place. Classement, bilan et objectif sont ceux de sa fiche boxeur.",
    ambiance:
      "Allée de sacs et ring sous la charpente, avec le blason Boxing Center au mur.",
    pointsForts: [
      "Formation de boxeurs jusqu'au niveau professionnel",
      "Présence d'un boxeur professionnel encore en activité dans l'équipe d'encadrement",
      'Transmission : le pratiquant formé au club devient à son tour coach',
    ],
    url: 'https://boxe-toulouse.com/',
    urlLabel: 'boxe-toulouse.com',
    centerUrl: 'https://boxingcenter.fr/',
    image: '/img/bc-minimes-salle.jpg',
    imageAlt: 'Salle Boxing Center Minimes, allée de sacs et blason au mur, 12 rue de Fenouillet',
  },
  {
    slug: 'boxing-center-saint-cyprien',
    name: 'Boxing Center Saint-Cyprien',
    city: 'Toulouse',
    address: '11 rue Sainte-Lucie, 31300 Toulouse',
    addressSource: 'https://club-boxe-toulouse.com/',
    disciplines: ['Boxe anglaise', 'K1', 'Muay Thaï', 'Cross-training'],
    coachSlugs: ['dadi'],
    histoire:
      "Cinquième salle du réseau Boxing Center, la première en centre-ville. Le site indique le 11 rue Sainte-Lucie, à 4 minutes du métro Saint-Cyprien République, ouverte du lundi au samedi.",
    boxeursFormes: [],
    resultats:
      "La salle publie ses cours et son encadrement sur club-boxe-toulouse.com. Les bilans nominatifs ne sont pas repris ici.",
    ambiance:
      "Rive gauche, métro Saint-Cyprien République. Cours sans réservation du lundi au samedi, de 10 h à 21 h 15.",
    pointsForts: [
      'Boxe anglaise, K1, Muay Thaï et cross-training',
      '11 rue Sainte-Lucie, métro Saint-Cyprien République',
      'Ouvert 6 jours sur 7',
    ],
    url: 'https://club-boxe-toulouse.com/',
    urlLabel: 'club-boxe-toulouse.com',
    centerUrl: 'https://boxingcenter.fr/',
    image: '/img/bc-saint-cyprien-salle.jpg',
    imageAlt: 'Salle Boxing Center Saint-Cyprien, ring et sacs au 11 rue Sainte-Lucie',
  },
];

const coachsRaw = [
  {
    slug: 'valentin-guth',
    boxeurSlug: 'valentin-guth',
    name: 'Valentin Guth',
    city: 'Toulouse',
    role: 'Boxe anglaise, boxeur en activité',
    diplomes: ['BPJEPS mention Boxe', 'BPJEPS mention Sports de Contact'],
    diplomesSource: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
    clubSlugs: ['boxing-center-toulouse-minimes'],
    boxeursFormes:
      "Le club le présente auprès des débutants, des loisirs, des enfants et des confirmés. La liste nominative des boxeurs qu'il a menés à un titre n'est pas publiée ici.",
    methode:
      "Une boxe vécue sur le ring, pas seulement expliquée. Il continue sa carrière professionnelle et s'en sert pour transmettre les exigences du combat aux adhérents.",
    parcours:
      "Formé comme boxeur au Boxing Center de Toulouse, passé professionnel, puis coach diplômé dans le même club. Le site le classe 3e français chez les super-coqs.",
    ficheUrl: 'https://boxingcenter.fr/coachs-2/coach-valentin-guth/',
  },
  {
    slug: 'dadi',
    name: 'Dadi',
    city: 'Toulouse',
    photo: '/img/coachs/dadi.jpg',
    photoAlt: 'Dadi, coach de boxe anglaise à Saint-Cyprien',
    role: 'Anglaise, Lady Punch, école',
    diplomes: [],
    diplomesSource: 'https://club-boxe-toulouse.com/coachs/',
    clubSlugs: ['boxing-center-saint-cyprien'],
    boxeursFormes: "Anglaise, Lady Punch et école, à Saint-Cyprien.",
    methode: "Boxe anglaise et école.",
    parcours: "Saint-Cyprien le présente comme le pilier de l'anglaise, de la Lady Punch et de l'école.",
    ficheUrl: 'https://club-boxe-toulouse.com/coachs/',
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
const combatsRaw = [
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
    boxerA: 'Bakhodir Jalolov',
    boxerB: 'Solomon Dacres',
    category: 'Poids lourds',
    titles: '',
    city: 'Londres, Royaume-Uni',
    stakes: 'Dix rounds en lever de rideau de Dubois contre Wardley, à l’O2 Arena.',
  },
  {
    status: 'a-venir',
    date: '2026-10-17',
    boxerA: 'Louie O\'Doherty',
    boxerB: 'Michael Gomez Jr',
    category: 'Poids légers',
    titles: 'Titre britannique et Commonwealth des poids légers',
    city: 'Londres, Royaume-Uni',
    stakes: 'Ceintures britannique et Commonwealth en jeu sur la carte de l’O2 Arena.',
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
  {
    status: 'a-venir',
    date: '2026-11-07',
    boxerA: 'Joshua Buatsi',
    boxerB: 'Willy Hutchinson',
    category: 'Mi-lourds',
    titles: 'Titre WBC intérimaire des mi-lourds',
    city: 'Manchester, Royaume-Uni',
    stakes: 'Ceinture intérimaire WBC à l’AO Arena, carte DAZN.',
  },
  {
    status: 'a-venir',
    date: '2026-11-07',
    boxerA: 'Chris Billam-Smith',
    boxerB: 'Cheavon Clarke',
    category: 'Lourds-légers',
    titles: '',
    city: 'Londres, Royaume-Uni',
    stakes: 'Dix rounds à la Copper Box Arena, carte Paramount+ et Sky Sports.',
  },
  {
    status: 'a-venir',
    date: '2026-11-08',
    boxerA: 'Elif Nur Turhan',
    boxerB: 'Alycia Baumgardner',
    category: 'Poids légers',
    titles: 'Championnat du monde IBF des poids légers',
    city: 'Arlington, États-Unis',
    stakes: 'Turhan défend l’IBF. Baumgardner monte à 135 livres pour un deuxième titre mondial, à College Park Center.',
  },
  {
    status: 'a-venir',
    date: '2026-11-08',
    boxerA: 'Tiara Brown',
    boxerB: 'Ellie Scotney',
    category: 'Poids plumes',
    titles: 'Championnat du monde WBC des poids plumes',
    city: 'Arlington, États-Unis',
    stakes: 'Brown défend la ceinture WBC. Scotney monte de catégorie.',
  },
  {
    status: 'a-venir',
    date: '2026-11-08',
    boxerA: 'Skye Nicolson',
    boxerB: 'Miyo Yoshida',
    category: 'Super-coqs',
    titles: 'Championnat du monde WBC des super-coqs',
    city: 'Arlington, États-Unis',
    stakes: 'Nicolson défend sa ceinture WBC en dix rounds.',
  },
  {
    status: 'a-venir',
    date: '2026-11-08',
    boxerA: 'Ramla Ali',
    boxerB: 'Mikiah Kreps',
    category: 'Super-coqs',
    titles: 'Championnats du monde WBO et IBF des super-coqs',
    city: 'Arlington, États-Unis',
    stakes: 'Deux ceintures mondiales vacantes sur la carte ESPN de College Park Center.',
  },
  {
    status: 'a-venir',
    date: '2026-11-12',
    boxerA: 'Steven Butler',
    boxerB: 'Erik Bazinyan',
    category: 'Super-moyens',
    titles: '',
    city: 'Montréal, Canada',
    stakes: 'Duel québécois au Cabaret du Casino de Montréal, carte Eye of the Tiger sur DAZN.',
  },
  {
    status: 'a-venir',
    date: '2026-11-14',
    boxerA: 'Bakary Samaké',
    boxerB: 'Uisma Lima',
    category: 'Super-welters',
    titles: 'Titre WBC International des super-welters',
    city: 'Levallois-Perret',
    stakes: 'Samaké, après sa défaite contre Hadribeaj, vise la ceinture internationale de Lima au Palais des Sports Marcel-Cerdan.',
  },
  {
    status: 'a-venir',
    date: '2026-11-28',
    boxerA: 'Agit Kabayel',
    boxerB: 'Nelson Hysa',
    category: 'Poids lourds',
    titles: 'Championnat du monde WBC des poids lourds',
    city: 'Düsseldorf, Allemagne',
    stakes: 'Première défense de Kabayel à la Merkur Spiel-Arena, deux invaincus, carte DAZN.',
  },
  {
    status: 'a-venir',
    date: '2026-12-11',
    boxerA: 'Tyson Fury',
    boxerB: 'Anthony Joshua',
    category: 'Poids lourds',
    titles: 'Championnat du monde WBA Super des poids lourds',
    city: 'Cardiff, Pays de Galles',
    stakes: 'Ceinture WBA Super vacante au Principality Stadium, en direct sur Netflix.',
  },
  {
    status: 'a-venir',
    date: '2026-12-19',
    boxerA: 'Anthony Cacace',
    boxerB: 'Nick Ball',
    category: 'Super-plumes',
    titles: 'Championnat du monde WBA des super-plumes',
    city: 'Belfast, Royaume-Uni',
    stakes: 'Cacace défend la ceinture WBA à la SSE Arena, carte DAZN.',
  },
  {
    status: 'dispute',
    date: '2026-10-03',
    boxerA: 'Ben Whittaker',
    boxerB: 'Conor Wallace',
    category: 'Mi-lourds',
    titles: 'Eliminatoire IBF des mi-lourds',
    city: 'Birmingham, Royaume-Uni',
    winner: 'Ben Whittaker',
    method: 'Décision unanime',
    decision: '117-111, 116-112, 115-113',
    stakes: 'Whittaker devient challenger obligatoire IBF, à l’Utilita Arena de Birmingham.',
  },
  {
    status: 'dispute',
    date: '2026-09-27',
    boxerA: 'Takuma Inoue',
    boxerB: 'Tenshin Nasukawa',
    category: 'Poids coqs',
    titles: 'Championnat du monde WBC des poids coqs',
    city: 'Tokyo, Japon',
    winner: 'Takuma Inoue',
    method: 'Décision unanime',
    decision: '116-111, 116-111, 114-113',
    stakes: 'Inoue conserve sa ceinture à la Toyota Arena, revanche du combat de novembre 2025.',
  },
  {
    status: 'dispute',
    date: '2026-09-27',
    boxerA: 'Ricardo Malajika',
    boxerB: 'Tomoya Tsuboi',
    category: 'Super-mouches',
    titles: 'Championnat du monde WBC des super-mouches',
    city: 'Tokyo, Japon',
    winner: 'Ricardo Malajika',
    method: 'Décision partagée',
    decision: '116-112, 115-113, 113-115',
    stakes: 'Malajika, Sud-Africain, prend la ceinture vacante à Tokyo.',
  },
  {
    status: 'dispute',
    date: '2026-09-27',
    boxerA: 'Sam Goodman',
    boxerB: 'Ryosuke Nishida',
    category: 'Super-coqs',
    titles: 'Titre IBF intérimaire des super-coqs',
    city: 'Tokyo, Japon',
    winner: 'Sam Goodman',
    method: 'Décision unanime',
    decision: '116-109, 115-110, 114-111',
    stakes: 'Goodman s’empare de la ceinture intérimaire IBF à Tokyo.',
  },
  {
    status: 'dispute',
    date: '2026-09-27',
    boxerA: 'Ryusei Matsumoto',
    boxerB: 'Russell Acosta',
    category: 'Poids pailles',
    titles: 'Titre WBO intérimaire des poids pailles',
    city: 'Tokyo, Japon',
    winner: 'Ryusei Matsumoto',
    method: 'Décision unanime',
    decision: '118-110, 116-112, 115-113',
    stakes: 'Matsumoto conserve la ceinture intérimaire WBO à Tokyo.',
  },
];

/** @type {Array<Record<string, string>>} */
const galasRaw = [
  {
    date: '2026-09-27',
    name: 'Inoue contre Nasukawa 2',
    city: 'Tokyo, Toyota Arena',
    note: 'Quatre titres mondiaux à la Toyota Arena. Affiche principale : Inoue conserve le WBC des poids coqs.',
  },
  {
    date: '2026-10-03',
    name: 'Whittaker contre Wallace',
    city: 'Birmingham, Utilita Arena',
    note: 'Eliminatoire IBF des mi-lourds. Whittaker l’emporte aux points.',
  },
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
  {
    date: '2026-11-07',
    name: 'Buatsi contre Hutchinson',
    city: 'Manchester, AO Arena',
    note: 'Titre WBC intérimaire des mi-lourds. Carte DAZN.',
  },
  {
    date: '2026-11-07',
    name: 'Billam-Smith contre Clarke',
    city: 'Londres, Copper Box Arena',
    note: 'Dix rounds chez les lourds-légers. Carte Paramount+ et Sky Sports.',
  },
  {
    date: '2026-11-08',
    name: 'MVPW-07 à Arlington',
    city: 'Arlington, College Park Center',
    note: 'Quatre titres mondiaux : Turhan-Baumgardner, Brown-Scotney, Nicolson-Yoshida, Ali-Kreps. Carte ESPN.',
  },
  {
    date: '2026-11-12',
    name: 'Eye of the Tiger à Montréal',
    city: 'Montréal, Casino',
    note: 'Butler contre Bazinyan chez les super-moyens. Diffusion DAZN.',
  },
  {
    date: '2026-11-14',
    name: 'Samaké Promotion',
    city: 'Levallois-Perret, Marcel-Cerdan',
    note: 'Bakary Samaké contre Uisma Lima pour le titre WBC International des super-welters.',
  },
  {
    date: '2026-11-28',
    name: 'Kabayel contre Hysa',
    city: 'Düsseldorf, Merkur Spiel-Arena',
    note: 'Première défense du titre WBC des poids lourds. Carte DAZN.',
  },
  {
    date: '2026-12-11',
    name: 'Fury contre Joshua',
    city: 'Cardiff, Principality Stadium',
    note: 'Titre WBA Super des poids lourds, vacant. Direct Netflix.',
  },
  {
    date: '2026-12-19',
    name: 'Cacace contre Ball',
    city: 'Belfast, SSE Arena',
    note: 'Défense du titre WBA des super-plumes. Carte DAZN.',
  },
];

function nameKey(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function fightPairKey(fight) {
  return `${fight.date}|${nameKey(fight.boxerA)}|${nameKey(fight.boxerB)}`;
}

function sameFight(a, b) {
  if (!a || !b || a.date !== b.date) return false;
  const left = `${nameKey(a.boxerA)}|${nameKey(a.boxerB)}`;
  const right = `${nameKey(b.boxerA)}|${nameKey(b.boxerB)}`;
  const swapped = `${nameKey(b.boxerB)}|${nameKey(b.boxerA)}`;
  return left === right || left === swapped;
}

function applyFightUpdate(fight) {
  const update = combatsUpdates.find((row) => sameFight(fight, row));
  return update ? { ...fight, ...update } : fight;
}

function mergeAutoFights(manual, auto) {
  const seen = new Set(manual.map(fightPairKey));
  const extra = [];
  for (const fight of auto) {
    if (!fight?.boxerA || !fight?.boxerB || !fight?.date) continue;
    const key = fightPairKey(fight);
    const swapped = `${fight.date}|${nameKey(fight.boxerB)}|${nameKey(fight.boxerA)}`;
    if (seen.has(key) || seen.has(swapped)) continue;
    seen.add(key);
    extra.push(fight);
  }
  return [...manual, ...extra];
}

function logisticsFrom(text = '') {
  const source = String(text || '');
  const venueMatch = source.match(
    /(?:à l['’]|à la |à |au |aux )([^.,]{2,80}?(?:Arena|Center|Centre|Cordouan|Soucoupe|Roseaux|Capitole|Stadium|Palais des Sports|Casino de Montréal|Marcel-Cerdan|gymnase)[^.,]{0,40})/i,
  );
  const timeMatch = source.match(/\b(\d{1,2}\s*h(?:eures)?(?:\s*\d{2})?)\b/i);
  const channels = ['DAZN', 'TNT', 'Netflix', 'Paramount+', 'Sky Sports', 'ESPN'].filter((name) => {
    if (name === 'TNT') return /\bTNT\b/.test(source);
    if (name === 'ESPN') return /\bESPN\b/.test(source);
    return source.includes(name);
  });
  const venue = venueMatch ? venueMatch[1].trim() : '';
  return {
    venue: venue ? venue.charAt(0).toUpperCase() + venue.slice(1) : '',
    time: timeMatch ? timeMatch[1].replace(/\s+/g, ' ') : '',
    channel: channels.join(', '),
  };
}

function venueFromGalaCity(city = '') {
  const part = String(city).split(',').slice(1).join(',').trim();
  if (!part) return '';
  if (/arena|center|centre|cordouan|soucoupe|roseaux|capitole|stadium|palais|casino|cerdan|gymnase/i.test(part)) {
    return part;
  }
  return '';
}

function enrichFight(fight) {
  const slug = fight.slug || `${slugifyName(fight.boxerA)}-${slugifyName(fight.boxerB)}`;
  const logistics = logisticsFrom(fight.stakes || '');
  const lecture = lectures.find((row) => sameFight(fight, row));
  return {
    ...fight,
    slug,
    country: fight.country || countryCodeFromCity(fight.city),
    href: `/combats/${slug}`,
    venue: fight.venue || logistics.venue,
    time: fight.time || logistics.time,
    channel: fight.channel || logistics.channel,
    aboutA: fight.aboutA || '',
    aboutB: fight.aboutB || '',
    analysis: fight.analysis || lecture?.analysis || '',
    prediction: fight.prediction || lecture?.prediction || '',
  };
}

function cityKey(value = '') {
  return String(value)
    .split(',')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const combatsMerged = mergeAutoFights(combatsRaw, combatsAuto).map(applyFightUpdate);

function enrichGala(gala) {
  const slug = gala.slug || slugifyName(gala.name);
  const related = combatsMerged.find(
    (fight) => fight.date === gala.date && cityKey(fight.city) === cityKey(gala.city),
  );
  const logistics = logisticsFrom(`${gala.note || ''} ${gala.city || ''}`);
  return {
    ...gala,
    slug,
    country: gala.country || countryCodeFromCity(gala.city),
    href: `/galas/${slug}`,
    versus: related ? `${related.boxerA} / ${related.boxerB}` : '',
    venue: gala.venue || logistics.venue || venueFromGalaCity(gala.city),
    time: gala.time || logistics.time,
    channel: gala.channel || logistics.channel,
  };
}

function withCardLogistics(fights, galaList) {
  return fights.map((fight) => {
    const gala = galaList.find((item) => item.date === fight.date && cityKey(item.city) === cityKey(fight.city));
    if (!gala) return fight;
    return {
      ...fight,
      venue: fight.venue || gala.venue || '',
      time: fight.time || gala.time || '',
      channel: fight.channel || gala.channel || '',
    };
  });
}

export const galas = [...galasRaw, ...galasAuto].map(enrichGala);
export const combats = withCardLogistics(combatsMerged.map(enrichFight), galas);

export function fightBySlug(slug) {
  return combats.find((item) => item.slug === slug);
}

export function galaBySlug(slug) {
  return galas.find((item) => item.slug === slug);
}

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
