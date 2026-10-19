import type { Combat } from '../data/entities';
import type { CollectionEntry } from 'astro:content';

type ArticleEntry = CollectionEntry<'articles'>;
type EditionRow = [string, ArticleEntry[]];

export function editionPath(date: string | Date): string;
export function editionTitle(date: string | Date): string;
export function editionMeta(items: ArticleEntry[]): string;
export function monthKeyFromDay(dayKey: string): string;
export function monthTitle(ym: string): string;
export function groupEditionsByMonth(editions?: EditionRow[]): [string, EditionRow[]][];
export function parisTodayKey(now?: Date): string;
export function groupItemsByMonth<T>(
  items?: T[],
  getDate?: (item: T) => string | Date,
): [string, T[]][];
export function isUpcomingDate(date: string | Date, today?: string): boolean;
export function isUpcomingCombat(fight: Combat, today?: string): boolean;
export function isResultCombat(fight: Combat): boolean;
export function currentMonthKey(today?: string): string;
export function isCurrentMonth(date: string | Date, today?: string): boolean;
export function currentMonthEditions(editions?: EditionRow[], today?: string): EditionRow[];
export function archiveEditions(editions?: EditionRow[], today?: string): EditionRow[];
export function currentMonthItems<T>(
  items?: T[],
  getDate?: (item: T) => string | Date,
  today?: string,
): T[];
export function archiveMonthItems<T>(
  items?: T[],
  getDate?: (item: T) => string | Date,
  today?: string,
): T[];
