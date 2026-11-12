import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** 地图内容左上角在视口里的位置（像素）和缩放倍数（1 = 1 个地图单位 1 像素） */
export type View = { readonly x: number; readonly y: number; readonly k: number };

type Box = readonly [number, number, number, number];

const unionOf = (bs: readonly Box[]): Box => [
  Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])),
  Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3])),
];

/** 以泡泡扎堆的地方（横竖各取中位数）为中心，离得最远的一个个拿掉，直到剩下的装得进 w × h */
function crowd(boxes: readonly Box[], w: number, h: number): { box: Box; n: number } | null {
  const mid = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1];
  const c = boxes.map((b) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] as const);
  const cx = mid(c.map((p) => p[0])), cy = mid(c.map((p) => p[1]));
  const near = boxes.map((b, i) => ({ b, d: Math.hypot(c[i][0] - cx, c[i][1] - cy) })).sort((a, b) => a.d - b.d).map((o) => o.b);
  for (let n = near.length; n > 0; n--) {
    const box = unionOf(near.slice(0, n));
    if (box[2] - box[0] <= w && box[3] - box[1] <= h) return { box, n };
  }
  return null;
}

/** 拖动、滚轮、双指缩放和键盘移动地图。拖过再松手不算点击，免得一拖就点开了泡泡 */
export function usePanZoom(
  ref: RefObject<HTMLDivElement | null>, w: number, h: number, focus: Box, saved: View | null,
  /** 缩放到 k 时每个泡泡占的屏幕范围（从地图左上角算起），竖屏开场用它来挑一个都装得下的缩放 */
  balloons?: (k: number) => readonly Box[] | null,
  /** 开场左右尽量对准的地图点（地图单位） */
  middle?: readonly [number, number],
) {
  const [view, setViewState] = useState<View | null>(saved);
  const [animate, setAnimate] = useState(false);
  const viewRef = useRef(view);
  const size = useRef({ vw: 0, vh: 0 });

  const fitK = useCallback(() => {
    const { vw, vh } = size.current;
    const pad = 24;
    return Math.min((vw - pad * 2) / (focus[2] - focus[0]), (vh - pad * 2) / (focus[3] - focus[1]));
  }, [focus]);

  const limits = useCallback(() => {
    const { vw, vh } = size.current;
    const all = Math.min(vw / w, vh / h);
    const fit = fitK();
    return { min: Math.min(all, fit) * 0.95, max: Math.max(fit * 5, 2.4) };
  }, [fitK, w, h]);

  const clamp = useCallback((v: View): View => {
    const { vw, vh } = size.current;
    const { min, max } = limits();
    const k = Math.min(max, Math.max(min, v.k));
    const cw = w * k, ch = h * k;
    const x = cw <= vw ? (vw - cw) / 2 : Math.min(0, Math.max(vw - cw, v.x));
    const y = ch <= vh ? (vh - ch) / 2 : Math.min(0, Math.max(vh - ch, v.y));
    return { x, y, k };
  }, [limits, w, h]);

  const setView = useCallback((v: View, smooth = false) => {
    const next = clamp(v);
    viewRef.current = next;
    setAnimate(smooth);
    setViewState(next);
  }, [clamp]);

  // 整片框住，泡泡会叠成一团（手机上还小得看不清）：从比地图上下贴边再大一些开始一点点缩小，直到泡泡们都装得下。
  // 泡泡多了，缩到贴边那么小时就会叠在一起，所以从能放到的最大处往下找
  const home = useCallback((): View => {
    const { vw, vh } = size.current;
    const fit = fitK();
    if (balloons) {
      // 左右对准 middle，但排好的那一圈泡泡不能被推出屏幕
      const at = (k: number, e: Box): View => {
        const own = vw / 2 - (e[0] + e[2]) / 2;
        const lo = 6 - e[0], hi = vw - 6 - e[2];
        const x = middle && lo <= hi ? Math.min(hi, Math.max(lo, vw / 2 - middle[0] * k)) : own;
        return { k, x, y: vh / 2 + 20 - (e[1] + e[3]) / 2 };
      };
      // 都装不下时，退而求其次：从扎堆的地方往外数，离得最远的先放到屏幕外，能装下几个算几个，拖一拖再看
      let best: { k: number; e: Box; n: number } | null = null;
      for (let k = limits().max; k >= fit; k *= 0.95) {
        const boxes = balloons(k);
        if (!boxes) continue;
        const e = crowd(boxes, vw - 12, vh - 200);
        if (!e) continue;
        if (e.n === boxes.length) return at(k, e.box);
        if (!best || e.n >= best.n) best = { k, e: e.box, n: e.n };
      }
      if (best) return at(best.k, best.e);
    }
    return { k: fit, x: vw / 2 - ((focus[0] + focus[2]) / 2) * fit, y: vh / 2 - ((focus[1] + focus[3]) / 2) * fit };
  }, [fitK, focus, balloons, limits, middle]);

  // 开场那一屏左右看得到地图的哪一段（地图单位）：街道名尽量写在这段里
  const [opened, setOpened] = useState<readonly [number, number] | null>(null);
  const goHome = useCallback((): View => {
    const v = home();
    setOpened([-v.x / v.k, (size.current.vw - v.x) / v.k]);
    return v;
  }, [home]);

  const zoomAt = useCallback((px: number, py: number, factor: number, smooth = false) => {
    const v = viewRef.current;
    if (!v) return;
    const { min, max } = limits();
    const k = Math.min(max, Math.max(min, v.k * factor));
    setView({ k, x: px - ((px - v.x) * k) / v.k, y: py - ((py - v.y) * k) / v.k }, smooth);
  }, [limits, setView]);

  // 视口大小变了：第一次就框住三个街道，之后只把地图拉回界内
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      size.current = { vw: el.clientWidth, vh: el.clientHeight };
      setView(viewRef.current ?? goHome());
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, goHome, setView]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let start: { pts: { x: number; y: number }[]; view: View } | null = null;
    let dragged = false;

    const local = (e: PointerEvent | WheelEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const restart = () => {
      start = viewRef.current ? { pts: [...pointers.values()], view: viewRef.current } : null;
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, local(e));
      if (pointers.size === 1) dragged = false;
      restart();
    };
    const move = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId) || !start) return;
      pointers.set(e.pointerId, local(e));
      const pts = [...pointers.values()];
      const v = start.view;
      if (pts.length === 1 && start.pts.length === 1) {
        const dx = pts[0].x - start.pts[0].x, dy = pts[0].y - start.pts[0].y;
        if (!dragged && Math.hypot(dx, dy) > 6) {
          dragged = true;
          el.setPointerCapture(e.pointerId);
          el.classList.add('dragging');
        }
        if (dragged) setView({ k: v.k, x: v.x + dx, y: v.y + dy });
      } else if (pts.length >= 2 && start.pts.length >= 2) {
        dragged = true;
        const [a, b] = pts, [a0, b0] = start.pts;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const mid0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
        const k = v.k * (Math.hypot(a.x - b.x, a.y - b.y) / (Math.hypot(a0.x - b0.x, a0.y - b0.y) || 1));
        setView({ k, x: mid.x - ((mid0.x - v.x) * k) / v.k, y: mid.y - ((mid0.y - v.y) * k) / v.k });
      }
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (!pointers.size) el.classList.remove('dragging');
      restart();
    };
    const click = (e: MouseEvent) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e);
      zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)));
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('wheel', wheel);
    };
  }, [ref, setView, zoomAt]);

  const api = {
    view,
    animate,
    opened,
    zoomBy: (f: number) => zoomAt(size.current.vw / 2, size.current.vh / 2, f, true),
    panBy: (dx: number, dy: number) => viewRef.current && setView({ ...viewRef.current, x: viewRef.current.x + dx, y: viewRef.current.y + dy }, true),
    reset: () => setView(goHome(), true),
    /** 把地图上的一点移到视口里 (fx, fy) 的位置，比如把泡泡拉到中间偏上 */
    flyTo: (mx: number, my: number, fx = 0.5, fy = 0.5, k?: number) => {
      const v = viewRef.current;
      if (!v) return;
      const kk = k ?? Math.max(v.k, fitK() * 1.6);
      setView({ k: kk, x: size.current.vw * fx - mx * kk, y: size.current.vh * fy - my * kk }, true);
    },
  };
  return api;
}
