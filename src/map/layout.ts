import type { Topic } from '../topics/types';
import { STEM, type Lean } from './Bubble';
import { GEO, MAP_W, metersToUnits, project } from './geo';
import { LABEL_AT } from './MapArt';

/** 候选的挪法：泡泡离钉子越近越好，从原地开始，按挪得远近一个个试 */
const TRIES: readonly Lean[] = [
  { ox: 0, lift: 0 }, { ox: -90, lift: 0 }, { ox: 90, lift: 0 }, { ox: -60, lift: 60 }, { ox: 60, lift: 60 },
  { ox: 0, lift: 100 }, { ox: -120, lift: 30 }, { ox: 120, lift: 30 }, { ox: -90, lift: 110 }, { ox: 90, lift: 110 },
  { ox: -180, lift: 10 }, { ox: 180, lift: 10 }, { ox: 0, lift: 160 },
  { ox: -90, lift: 160 }, { ox: 90, lift: 160 }, { ox: -180, lift: 80 }, { ox: 180, lift: 80 }, { ox: 0, lift: 220 },
].sort((a, b) => Math.hypot(a.ox, a.lift) - Math.hypot(b.ox, b.lift));
/** 一个泡泡连小牌子在屏幕上大概占多大（像素）；牌子比泡泡宽，算总范围时两边再各留一点 */
const BOX = { w: 84, h: 96 };
const SKY = { w: 92, h: 104 };
/** 「我家」：底下的小房子，和头顶那句话（离钉子多高、多大） */
const HOUSE = { up: 42, w: 100, h: 84 };
const SAY = { up: 136, w: 280, h: 86 };
const TAG_OVERHANG = 12;
/** 两个泡泡之间至少空这么多像素，挨得太紧看着像叠在一起 */
const GAP = 16;

type Rect = { cx: number; cy: number; w: number; h: number };
const apart = (a: Rect, b: Rect) =>
  Math.abs(a.cx - b.cx) * 2 >= a.w + b.w + GAP * 2 || Math.abs(a.cy - b.cy) * 2 >= a.h + b.h + GAP * 2;
const overlap = (a: Rect, b: Rect) =>
  Math.max(0, (a.w + b.w) / 2 + GAP - Math.abs(a.cx - b.cx)) * Math.max(0, (a.h + b.h) / 2 + GAP - Math.abs(a.cy - b.cy));
/** 地图左右两边再往外就拖不过去了，泡泡连牌子不能伸到外面 */
const inside = (r: Rect, k: number) => r.cx - r.w / 2 - TAG_OVERHANG >= 0 && r.cx + r.w / 2 + TAG_OVERHANG <= MAP_W * k;

/** 在「泡泡自己的像素」里排：地图缩放 k、泡泡缩放 s 时，两个泡泡的距离相当于 k / s */
function place(topics: readonly Topic[], k: number) {
  const taken: Rect[] = topics.filter((t) => t.home).flatMap((t) => {
    const [x, y] = project(t.anchor.lat, t.anchor.lon);
    return [HOUSE, SAY].map(({ up, w, h }) => ({ cx: x * k, cy: y * k - up, w, h }));
  });
  // 小房子外面那一圈虚线是「我家这一片」：钉在圈外的泡泡别压上去；钉在圈里的，只要别挡住小房子
  const rings: Rect[] = topics.filter((t) => t.home && t.anchor.kind === 'area').map((t) => {
    const [x, y] = project(t.anchor.lat, t.anchor.lon);
    const d = Math.min(160, metersToUnits(t.anchor.kind === 'area' ? t.anchor.radius : 0) * 1.8 * k);
    return { cx: x * k, cy: y * k, w: d, h: d };
  });
  const items = topics
    .filter((t) => !t.home)
    .map((t) => ({ t, p: project(t.anchor.lat, t.anchor.lon), sky: t.anchor.kind === 'sky' }))
    .sort((a, b) => Number(b.sky) - Number(a.sky) || a.p[1] - b.p[1]);
  const leans = new Map<string, Lean>();
  let stuck = 0;
  for (const { t, p, sky } of items) {
    const size = sky ? SKY : BOX;
    const rect = (l: Lean): Rect => ({ cx: p[0] * k + l.ox, cy: p[1] * k - (sky ? 0 : STEM + l.lift) - size.h / 2, ...size });
    const tries = sky ? TRIES.slice(0, 1) : TRIES;
    const pin: Rect = { cx: p[0] * k, cy: p[1] * k, w: 0, h: 0 };
    const keep = rings.filter((r) => apart(r, pin));
    const pick = tries.find((l) => inside(rect(l), k) && taken.every((o) => apart(o, rect(l))) && keep.every((o) => apart(o, rect(l))));
    if (!pick) stuck++;
    // 哪儿都挤的时候，挑一个跟别人叠得最少的地方，别缩回原地被「我家」那句话盖住
    const cost = (l: Lean) => [...taken, ...keep].reduce((s, o) => s + overlap(o, rect(l)), 0) + (inside(rect(l), k) ? 0 : 1e6);
    const lean = pick ?? tries.reduce((a, b) => (cost(b) < cost(a) ? b : a));
    taken.push(rect(lean));
    leans.set(t.id, lean);
  }
  return { leans, rects: taken, rings, stuck };
}

/** 给每个泡泡挑一个不和别人重叠的位置；钉子永远钉在真实的地点。k 是地图缩放，s 是泡泡缩放 */
export function layoutBubbles(topics: readonly Topic[], k: number, s = 1): Map<string, Lean> {
  return place(topics, k / s).leans;
}

/** 点在不在街道的边界里（边界可能有好几圈，按奇偶算） */
function within(rings: readonly (readonly [number, number])[][], x: number, y: number) {
  let hit = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
}

/**
 * 三个街道的大字能写在哪儿（地图单位，字的基线中点）。字号 36、字距 5，大约 41 一个字、46 高。
 * 字的中间和两头都要落在自己街道里，不然看不出是哪一片。
 */
const STREETS = GEO.areas.filter((a) => a.ours && a.label).map((a) => {
  const rings = a.d.split(/M/).filter(Boolean).map((part) => {
    const n = part.match(/-?\d+(\.\d+)?/g)!.map(Number);
    return Array.from({ length: n.length >> 1 }, (_, i) => [n[i * 2], n[i * 2 + 1]] as const);
  });
  const xs = rings.flat().map((p) => p[0]), ys = rings.flat().map((p) => p[1]);
  const w = a.name.length * 41 + 8, h = 46;
  const spots: (readonly [number, number])[] = [];
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 12) {
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 12) {
      if ([x, x - w / 2 + 30, x + w / 2 - 30].every((sx) => within(rings, sx, y - 13))) spots.push([x, y]);
    }
  }
  return { name: a.name, w, h, home: LABEL_AT[a.name] ?? a.label!, spots };
});

/**
 * 地图缩放到 k 时，每个街道名写在哪儿：在自己街道里挑一块最不被泡泡盖住的地方，
 * 一样空的话离平时的位置越近越好。泡泡大小跟着屏幕走、字跟着地图走，所以缩放一变就得重新挑。
 */
export function streetNameSpots(
  topics: readonly Topic[], k: number, s = 1,
  /** 开场时屏幕左右能看到的地图范围（地图单位）；字尽量别写到屏幕外面去 */
  seen?: readonly [number, number],
): Record<string, readonly [number, number]> {
  const kk = k / s;
  const { rects, rings } = place(topics, kk);
  const boxes = [...rects, ...rings].map((r) => ({ cx: r.cx / kk, cy: r.cy / kk, w: (r.w + TAG_OVERHANG * 2) / kk, h: r.h / kk }));
  const out: Record<string, readonly [number, number]> = {};
  // 和 index.css 里一样：放大时字不跟着变大，屏幕上最大 44 像素
  const f = Math.min(1, 44 / 36 / k);
  for (const st of STREETS) {
    const box = ([x, y]: readonly [number, number]): Rect => ({ cx: x, cy: y - 13 * f, w: st.w * f, h: st.h * f });
    const covered = (a: Rect, b: Rect) =>
      Math.max(0, (a.w + b.w) / 2 - Math.abs(a.cx - b.cx)) * Math.max(0, (a.h + b.h) / 2 - Math.abs(a.cy - b.cy));
    const away = (p: readonly [number, number]) => (seen ? Math.max(0, seen[0] - (p[0] - st.w * f / 2), p[0] + st.w * f / 2 - seen[1]) : 0);
    const cost = (p: readonly [number, number]) =>
      boxes.reduce((sum, b) => sum + covered(b, box(p)), 0) + Math.hypot(p[0] - st.home[0], p[1] - st.home[1]) * 4 * f + away(p) * st.h * f * 4;
    const best = [st.home, ...st.spots].reduce((a, b) => (cost(b) < cost(a) ? b : a));
    out[st.name] = best;
    boxes.push(box(best));
  }
  return out;
}

/**
 * 地图缩放到 k 时，每个泡泡连牌子占的范围：[左, 上, 右, 下]，单位是屏幕像素，从地图左上角算起。
 * 有泡泡找不到空位、只能叠在别人身上时返回 null。
 */
export function bubbleBoxes(topics: readonly Topic[], k: number, s = 1): (readonly [number, number, number, number])[] | null {
  const { rects, stuck } = place(topics, k / s);
  if (!rects.length || stuck) return null;
  return rects.map((r) => [
    (r.cx - r.w / 2 - TAG_OVERHANG) * s, (r.cy - r.h / 2) * s,
    (r.cx + r.w / 2 + TAG_OVERHANG) * s, (r.cy + r.h / 2) * s,
  ] as const);
}
