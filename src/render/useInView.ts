import { useEffect, useRef, useState } from 'react';
import { REDUCED_MOTION, SNAP } from './env';

/** 元素第一次滚进屏幕时变成 true，之后不再变回去 */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(SNAP);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver((records) => {
      if (records.some((r) => r.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}

/** 按住一段时间的动画：run 为 true 时 t 从 0 走到 1，用 ms 毫秒；不要动画时直接到 1 */
export function useTween(run: boolean, ms: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run) { setT(0); return; }
    if (SNAP || REDUCED_MOTION) { setT(1); return; }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, ms]);
  return t;
}
