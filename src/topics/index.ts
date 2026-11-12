import type { Topic } from './types';

const mods = import.meta.glob<{ default: Topic }>('./*/topic.ts', { eager: true });

export const TOPICS: readonly Topic[] = Object.values(mods)
  .map((m) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);

/** 写完了的篇数：有问答、不是草稿 */
export const readyCount = (t: Topic) => t.articles.filter((a) => a.dialogue && !a.draft).length;
