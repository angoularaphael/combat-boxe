const SITE = 'https://combat-boxe.com';

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
        url: canonical('/img/logo.png'),
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
    image: canonical(club.image),
  };
}

export function graph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

export const organizationLd = {
  '@type': 'NewsMediaOrganization',
  name: 'Combat Boxe',
  url: SITE,
  logo: canonical('/img/logo.png'),
  description:
    'Média indépendant sur les combats de boxe, les résultats, les calendriers, les boxeurs, les clubs et les entraîneurs.',
};
