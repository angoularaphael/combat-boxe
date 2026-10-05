import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const crumb = z.object({
  href: z.string(),
  label: z.string(),
});

const link = z.object({
  href: z.string(),
  label: z.string(),
});

const source = z.object({
  name: z.string(),
  url: z.string(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    date: z.coerce.date(),
    status: z.enum(['draft', 'published']),
    family: z.enum(['actualite', 'fond', 'guide']),
    kind: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    breadcrumbs: z.array(crumb),
    pillars: z.array(link),
    sources: z.array(source).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    template: z.enum([
      'hub',
      'news',
      'upcoming',
      'results',
      'calendar',
      'galas',
      'boxers-fr',
      'boxers-int',
      'portraits',
      'clubs',
      'coaches',
      'analyses',
      'interviews',
      'dossiers',
      'legal',
    ]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    breadcrumbs: z.array(crumb),
  }),
});

export const collections = { articles, pages };
