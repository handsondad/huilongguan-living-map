import { useEffect, useState } from 'react';

/** ?snap：截图模式，动画直接到终点 */
export const SNAP = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('snap');

export const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** 翻开一篇文章再回来，地图还停在原来的样子 */
export function useSaved<T>(name: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try { return JSON.parse(sessionStorage.getItem(name) ?? '') as T; } catch { return fallback; }
  });
  useEffect(() => { sessionStorage.setItem(name, JSON.stringify(value)); }, [name, value]);
  return [value, setValue] as const;
}
