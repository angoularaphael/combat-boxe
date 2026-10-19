import type { CollectionEntry } from 'astro:content';

export type ArticleData = CollectionEntry<'articles'>['data'];
export type PageData = CollectionEntry<'pages'>['data'];
export type LiveArticleData = ArticleData & { boxeur?: Boxeur };

export interface CombatClip {
  url?: string;
  title?: string;
  source?: string;
  kind?: string;
  context?: string;
}

export interface Combat {
  slug: string;
  href: string;
  date: string;
  boxerA: string;
  boxerB: string;
  status?: string;
  category?: string;
  titles?: string;
  city?: string;
  country?: string;
  venue?: string;
  time?: string;
  channel?: string;
  winner?: string;
  method?: string;
  decision?: string;
  stakes?: string;
  article?: string;
  clips?: CombatClip[];
  aboutA?: string;
  aboutB?: string;
  analysis?: string;
  prediction?: string;
}

export interface Gala {
  slug: string;
  href: string;
  date: string;
  name: string;
  city?: string;
  country?: string;
  note?: string;
  versus?: string;
  sourceUrl?: string;
  time?: string;
  channel?: string;
}

export interface Boxeur {
  slug: string;
  name: string;
  country?: string;
  clubSlug?: string;
  coachSlug?: string;
  photo?: string;
  photoAlt?: string;
  photoSource?: string;
  photoSourceLabel?: string;
  international?: boolean;
  category?: string;
  ranking?: string;
  rankingSource?: string;
  recordNote?: string;
  record?: string;
  gym?: string;
  verified?: string;
  objectif?: string;
  style?: string;
  parcours?: string;
  palmares?: string;
  combatsMarquants?: string;
  prochaines?: string;
  article?: string;
}

export interface Club {
  slug: string;
  name: string;
  city?: string;
  address?: string;
  addressSource?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  urlLabel?: string;
  centerUrl?: string;
  disciplines: string[];
  coachSlugs: string[];
  boxeursFormes: string[];
  histoire?: string;
  resultats?: string;
  ambiance?: string;
  pointsForts: string[];
}

export interface Coach {
  slug: string;
  name: string;
  city?: string;
  role?: string;
  photo?: string;
  photoAlt?: string;
  diplomes: string[];
  diplomesSource?: string;
  clubSlugs: string[];
  boxeurSlug?: string;
  boxeursFormes?: string;
  methode?: string;
  parcours?: string;
  ficheUrl?: string;
  resultats?: string;
  article?: string;
  ranking?: string;
  recordNote?: string;
  prochaines?: string;
  category?: string;
  objectif?: string;
}

export const boxeurs: Boxeur[];
export const clubs: Club[];
export const coachs: Coach[];
export const galas: Gala[];
export const combats: Combat[];

export function fightBySlug(slug: string): Combat | undefined;
export function galaBySlug(slug: string): Gala | undefined;
export function formatDate(date: string | Date): string;
export function parisDayKey(date: string | Date): string;
export function liveArticle(data: ArticleData): LiveArticleData;
export function groupArticlesByDay<T extends CollectionEntry<'articles'>>(
  articles: T[],
): [string, T[]][];
export function boxeurBySlug(slug: string): Boxeur | undefined;
export function clubBySlug(slug?: string): Club | undefined;
export function coachBySlug(slug?: string): Coach | undefined;
export function kindLabel(kind: string): string;
