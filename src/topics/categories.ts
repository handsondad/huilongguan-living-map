import type { CategoryId } from './types';

export type Category = { readonly id: CategoryId; readonly name: string; readonly icon: string; readonly color: string };

/** 泡泡的描边颜色就是类别的颜色 */
export const CATEGORIES: readonly Category[] = [
  { id: 'history', name: '名字与历史', icon: '📜', color: '#a66cff' },
  { id: 'move', name: '运动与出行', icon: '🚲', color: '#4d96ff' },
  { id: 'play', name: '玩耍与休闲', icon: '🛝', color: '#ff6b6b' },
  { id: 'home', name: '社区与日常', icon: '🏠', color: '#ff9f43' },
  { id: 'nature', name: '植物与动物', icon: '🌳', color: '#3dbb5a' },
  { id: 'senses', name: '声音与感受', icon: '👂', color: '#ff6bd6' },
];

export const categoryOf = (id: CategoryId): Category => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
