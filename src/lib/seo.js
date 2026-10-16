import keywords from '../data/seo-keywords.json';

const SITE = 'https://combat-boxe.com';

export const searchKeywords = [...keywords.principaux, ...keywords.longue_traine];

export function canonical(path) {
  if (!path || path === '/') return SITE;
  return SITE + (path.startsWith('/') ? path : `/${path}`);
}

export function breadcrumbLd(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href.startsWith('http') ? c.href : canonical(c.href),
    })),
  };
}

export function articleLd({ title, description, path, date, image }) {
  return {
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
    mainEntityOfPage: canonical(path),
    image: image.startsWith('http') ? image : canonical(image),
    inLanguage: 'fr-FR',
    author: { '@type': 'Organization', name: 'Combat Boxe', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Combat Boxe',
      url: SITE,
      logo: {
        '@type': 'ImageObject',
        url: canonical('/favicon-512.png'),
        width: 512,
        height: 512,
      },
    },
  };
}

export function personLd(person, path) {
  return {
    '@type': 'Person',
    name: person.name,
    url: canonical(path),
    image: person.photo ? canonical(person.photo) : undefined,
    jobTitle: person.jobTitle,
    nationality: person.country ? { '@type': 'Country', name: person.country } : undefined,
  };
}

export function clubLd(club) {
  return {
    '@type': 'SportsOrganization',
    name: club.name,
    sport: 'Boxe anglaise',
    url: club.url,
    address: club.address,
    image: canonical(club.image || '/img/og-combat-boxe.jpg'),
  };
}

export function collectionLd({ title, description, path, items }) {
  return {
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical(path),
    inLanguage: 'fr-FR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: canonical(`/${item.data.slug}`),
        name: item.data.h1,
      })),
    },
  };
}

export function graph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

export function webPageLd({ title, description, path, name }) {
  return {
    '@type': 'WebPage',
    '@id': `${canonical(path)}#webpage`,
    url: canonical(path),
    name: name || title,
    headline: title,
    description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${SITE}/#website` },
    about: [
      { '@type': 'Thing', name: 'combat boxe' },
      { '@type': 'Thing', name: 'combats de boxe' },
      { '@type': 'Thing', name: 'combat de boxe' },
      { '@type': 'Sport', name: 'Boxe anglaise' },
    ],
  };
}

export function faqLd(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export const organizationLd = {
  '@type': 'NewsMediaOrganization',
  '@id': `${SITE}/#organization`,
  name: 'Combat Boxe',
  alternateName: ['Combat boxe', 'Combat-Boxe.com'],
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: canonical('/favicon-512.png'),
    width: 512,
    height: 512,
  },
  image: canonical('/img/og-combat-boxe.jpg'),
  knowsAbout: searchKeywords,
  description:
    'Combat boxe : média indépendant sur les combats de boxe, les résultats, les calendriers, les boxeurs, les clubs et les entraîneurs.',
};

export const websiteLd = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Combat Boxe',
  alternateName: ['Combat boxe', 'Combat-Boxe.com', 'Combats de boxe'],
  inLanguage: 'fr-FR',
  publisher: { '@id': `${SITE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/actualites?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const hubFaq = [
  {
    q: "Qu'est-ce qu'un combat de boxe ?",
    a: "Un combat de boxe oppose deux boxeurs, dans une catégorie, à une date et dans un lieu. Un titre peut être en jeu. Combat Boxe suit ces affiches en France et à l'international.",
  },
  {
    q: 'Où suivre les combats de boxe à venir ?',
    a: 'Les combats de boxe à venir sont listés sur la page combats à venir, classés par mois. Le calendrier les range par date. Les soirées complètes sont sur les galas.',
  },
  {
    q: 'Où lire les résultats des combats de boxe ?',
    a: 'Les résultats des combats de boxe du mois sont sur la page résultats. Les mois passés restent consultables dans les archives des résultats.',
  },
];
