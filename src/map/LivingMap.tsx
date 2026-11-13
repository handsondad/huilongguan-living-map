import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { REDUCED_MOTION, SNAP, useSaved } from '../render/env';
import { CATEGORIES, categoryOf } from '../topics/categories';
import type { CategoryId, Topic } from '../topics/types';
import { Bubble, HomeMarker } from './Bubble';
import { GEO, MAP_H, MAP_W, metersToUnits, project } from './geo';
import { bubbleBoxes, layoutBubbles, streetNameSpots } from './layout';
import { MapArt } from './MapArt';
import { usePanZoom, type View } from './usePanZoom';

type Box = readonly [number, number, number, number];

function inFocus(t: Topic) {
  const [x, y] = project(t.anchor.lat, t.anchor.lon);
  const [x0, y0, x1, y1] = GEO.focus;
  return x >= x0 && x <= x1 && y >= y0 && y <= y1;
}

/** 三个街道的正中间：开场左右对着它 */
const MIDDLE = [(GEO.focus[0] + GEO.focus[2]) / 2, (GEO.focus[1] + GEO.focus[3]) / 2] as const;

/** 开场框住三个街道；有泡泡钉在框外（比如东小口森林公园），框就往外放一点，把它也装进来 */
function focusWith(topics: readonly Topic[]): Box {
  const pad = 60;
  let [x0, y0, x1, y1] = GEO.focus as unknown as Box;
  for (const t of topics) {
    const [x, y] = project(t.anchor.lat, t.anchor.lon);
    x0 = Math.min(x0, x - pad); y0 = Math.min(y0, y - pad);
    x1 = Math.max(x1, x + pad); y1 = Math.max(y1, y + pad);
  }
  return [Math.max(0, x0), Math.max(0, y0), Math.min(MAP_W, x1), Math.min(MAP_H, y1)];
}

export function LivingMap({ topics, last, onOpen }: {
  topics: readonly Topic[];
  /** 刚从哪个泡泡回来 */
  last: string | null;
  onOpen: (topicId: string) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  // 记住的位置按地图尺寸分开存：地图重新生成、范围变了，旧的位置就对不上了
  const [saved, setSaved] = useSaved<View | null>(`map-view-${MAP_W}x${MAP_H}`, null);
  // 泡泡之间要留空，原大小时地图得放得很大才排得开；手机上再小一号，不然挤得只能叠在一起
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 760px)');
    if (!mq) return;
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const bs = narrow ? 0.65 : 0.85;
  // 开场只管三个街道里的泡泡；离得远的（比如东小口森林公园）都算进来就缩得太小了，拖一拖再看
  const core = useMemo(() => topics.filter((t) => inFocus(t)), [topics]);
  const extent = useCallback((k: number) => bubbleBoxes(core, k, bs), [core, bs]);
  const focus = useMemo(() => focusWith(topics), [topics]);
  const pz = usePanZoom(viewport, MAP_W, MAP_H, focus, saved, extent, MIDDLE);
  const [off, setOff] = useSaved<CategoryId[]>('map-off', []);

  useEffect(() => {
    if (!pz.view) return;
    const t = setTimeout(() => setSaved(pz.view), 300);
    return () => clearTimeout(t);
  }, [pz.view, setSaved]);

  const toggle = (id: CategoryId) => setOff(off.includes(id) ? off.filter((c) => c !== id) : [...off, id]);
  const counts = new Map(CATEGORIES.map((c) => [c.id, topics.filter((t) => t.category === c.id).length]));
  const k = pz.view?.k ?? 1;
  const moving = !REDUCED_MOTION && !SNAP;

  const onKey = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const step = 90;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => pz.panBy(step, 0), ArrowRight: () => pz.panBy(-step, 0),
      ArrowUp: () => pz.panBy(0, step), ArrowDown: () => pz.panBy(0, -step),
      '+': () => pz.zoomBy(1.4), '=': () => pz.zoomBy(1.4), '-': () => pz.zoomBy(1 / 1.4), '0': () => pz.reset(),
    };
    moves[e.key]?.();
    if (moves[e.key]) e.preventDefault();
  };

  const shown = topics.filter((t) => t.home || !off.includes(t.category));
  const placed = layoutBubbles(shown, k, bs);
  const seen = pz.opened ? [pz.opened[0] + 10, pz.opened[1] + 28, pz.opened[2] - 10, pz.opened[3] - 18] as const : undefined;
  const spots = streetNameSpots(shown, k, bs, seen);
  // 位置没变就还用原来那个对象，地图底图不用重画
  const spotKey = JSON.stringify(spots);
  const names = useMemo(() => JSON.parse(spotKey) as typeof spots, [spotKey]);

  return (
    <section className="map-frame" aria-label="回龙观生活地图">
      <div ref={viewport} className="map-viewport" tabIndex={0} onKeyDown={onKey}
        aria-label="地图：拖动或用方向键移动，滚轮或加减号缩放，按 0 回到全图">
        {pz.view && (
          <div className={`map-world ${pz.animate ? 'animate' : ''}`} data-zoom={k < 1.3 ? 'far' : 'near'}
            style={{ width: MAP_W, height: MAP_H, transform: `translate(${pz.view.x}px, ${pz.view.y}px) scale(${k})`, '--k': k, '--bs': bs } as CSSProperties}>
            <MapArt moving={moving} names={names} />
            {/* 只给「我家」画一圈大概的范围；别的区域泡泡画了圈，看着像把某个街道单独圈出来 */}
            {topics.filter((t) => t.home && t.anchor.kind === 'area').map((t) => {
              const [x, y] = project(t.anchor.lat, t.anchor.lon);
              const r = metersToUnits(t.anchor.kind === 'area' ? t.anchor.radius : 0);
              return <span key={t.id} className={`fuzzy-area ${!t.home && off.includes(t.category) ? 'is-off' : ''}`} aria-hidden="true"
                style={{ left: x - r, top: y - r, width: r * 2, height: r * 2, '--c': categoryOf(t.category).color } as CSSProperties} />;
            })}
            {topics.map((t, i) => {
              const [x, y] = project(t.anchor.lat, t.anchor.lon);
              if (t.home) return <HomeMarker key={t.id} topic={t} x={x} y={y} on={last === t.id} onPick={() => onOpen(t.id)} />;
              return (
                <Bubble key={t.id} topic={t} x={x} y={y} lean={placed.get(t.id) ?? { ox: 0, lift: 0 }} order={i} on={last === t.id}
                  off={off.includes(t.category)} onPick={() => onOpen(t.id)} />
              );
            })}
          </div>
        )}

        {moving && (
          <div className="clouds" aria-hidden="true">
            <span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" />
          </div>
        )}
      </div>

      <div className="map-head">
        <div className="map-bar" role="group" aria-label="按颜色挑泡泡">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="cat-chip" style={{ '--c': c.color } as CSSProperties}
              aria-pressed={!off.includes(c.id)} onClick={() => toggle(c.id)}>
              <span aria-hidden="true">{c.icon}</span> {c.name}<b>{counts.get(c.id)}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="compass" aria-hidden="true"><span>北</span></div>

      <div className="zoom-ctl">
        <button type="button" onClick={() => pz.zoomBy(1.4)} aria-label="放大">＋</button>
        <button type="button" onClick={() => pz.zoomBy(1 / 1.4)} aria-label="缩小">－</button>
        <button type="button" onClick={() => pz.reset()} aria-label="回到全图">⌂</button>
      </div>

      <p className="map-hint" aria-hidden="true">👆 拖一拖地图，点一个泡泡</p>

      <p className="map-credit">
        底图 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> 贡献者<span className="wide-only">（{GEO.fetchedAt}） ·
        路、地铁、公园和街道边界是真实的</span> · 小楼和小树只是示意<span className="wide-only">，「我家」只画在大概的那一片</span>。
      </p>
    </section>
  );
}
