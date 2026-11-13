import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { GEO, polyline, project } from '../map/geo';
import { MapArt } from '../map/MapArt';
import { Cite } from '../render/Cite';
import { REDUCED_MOTION, SNAP } from '../render/env';
import type { Show } from '../topics/types';

/** 裁下来的那块地图：左上角的经纬度，宽高用地图单位，要把整条路装进去 */
const CROP = (() => {
  const [x, y] = project(40.07465, 116.28908);
  return { x, y, w: 500, h: 262 };
})();
/** OSM 里的专用路只到西二旗北路；最后 1 公里是改造过的西二旗北路辅路，按西二旗北路的点接到后厂村路 */
const TAIL = ([[40.05592, 116.30061], [40.05434, 116.29462], [40.05292, 116.29163]] as const)
  .map(([lat, lon]) => project(lat, lon))
  .map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`)
  .join('');
/** 动画里每秒骑多少公里 */
const KM_PER_S = 0.55;
/** 骑到一站停多久，让孩子读完那张卡 */
const HOLD_MS = 1600;

const pct = ([x, y]: [number, number]) => ({ left: `${((x - CROP.x) / CROP.w) * 100}%`, top: `${((y - CROP.y) / CROP.h) * 100}%` });

/** 在小地图上沿着路骑：按播放自己骑，也能拖滑块；每到一站停一下 */
export function RideShow({ show }: { show: Extract<Show, { kind: 'ride' }> }) {
  const { stops, speed } = show;
  const end = stops[stops.length - 1].km;
  const line = useMemo(() => polyline(GEO.cycleway.ride + TAIL), []);
  const closed = useMemo(() => polyline(GEO.cycleway.ride).total, []);
  const lenOf = (km: number) => (km / end) * line.total;
  // 挨得太近的两个站（比如转大圈下桥和钻铁路桥）把圆钮轻轻错开一点，免得盖住点不到
  const stopPins = useMemo(() => {
    const pts = stops.map((s) => [...line.at((s.km / end) * line.total)] as [number, number]);
    const minD = 26;
    for (let iter = 0; iter < 12; iter++) {
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[b][0] - pts[a][0], dy = pts[b][1] - pts[a][1];
          const d = Math.hypot(dx, dy) || 0.01;
          if (d < minD) {
            const push = (minD - d) / 2;
            const ux = dx / d, uy = dy / d;
            pts[a][0] -= ux * push; pts[a][1] -= uy * push;
            pts[b][0] += ux * push; pts[b][1] += uy * push;
          }
        }
      }
    }
    return pts;
  }, [stops, end, line]);

  const [km, setKm] = useState(SNAP ? end : 0);
  const [playing, setPlaying] = useState(false);
  const kmRef = useRef(km);
  kmRef.current = km;

  useEffect(() => {
    if (!playing) return;
    if (REDUCED_MOTION) { setKm(end); setPlaying(false); return; }
    let raf = 0;
    let last = performance.now();
    let hold = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (hold > 0) hold -= dt;
      else {
        const k = kmRef.current;
        let next = Math.min(end, k + (dt / 1000) * KM_PER_S);
        const reached = stops.find((s) => s.km > k && s.km <= next);
        if (reached) { next = reached.km; hold = HOLD_MS; }
        kmRef.current = next;
        setKm(next);
        if (next >= end) { setPlaying(false); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, end, stops]);

  const here = [...stops].reverse().find((s) => s.km <= km + 0.005) ?? stops[0];
  const minutes = Math.round((km / speed) * 60);
  const done = km >= end;
  const go = () => {
    if (done) { kmRef.current = 0; setKm(0); }
    setPlaying((p) => !p || done);
  };

  return (
    <>
      <div className="ride-map" style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}>
        <MapArt viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} moving={false} className="ride-art" />
        <svg className="ride-over" viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} aria-hidden="true">
          <path d={GEO.cycleway.ride} className="ride-todo" />
          <path d={`M${line.at(closed).join(' ')}${TAIL}`} className="ride-tail" />
          <path d={GEO.cycleway.ride + TAIL} className="ride-done" pathLength={line.total} strokeDasharray={`${lenOf(km)} ${line.total}`} />
        </svg>
        {stops.map((s, i) => (
          <button key={s.name} type="button" className={`ride-stop ${s.km <= km + 0.005 ? 'passed' : ''} ${s === here ? 'here' : ''}`}
            style={pct(stopPins[i])} aria-label={`第 ${i + 1} 站：${s.name}`}
            onClick={() => { setPlaying(false); setKm(s.km); }}>
            {i + 1}
          </button>
        ))}
        <span className="ride-bike" style={pct(line.at(lenOf(km)))} aria-hidden="true">🚲</span>
      </div>

      <div className="ride-ctl">
        <button type="button" className="btn small" onClick={go}>{playing ? '⏸ 停一下' : done ? '↻ 再骑一次' : km > 0 ? '▶ 接着骑' : '▶ 出发！'}</button>
        <input type="range" min={0} max={end} step={0.01} value={km} aria-label="骑到哪儿了"
          onChange={(e) => { setPlaying(false); setKm(Number(e.target.value)); }} />
        <p className="ride-read" aria-live="polite">
          <b>{km.toFixed(1)}</b> 公里 · 按每小时 {speed} 公里骑，用了 <b>{minutes}</b> 分钟
        </p>
      </div>

      <div className="ride-card" key={here.name} style={{ '--i': 0 } as CSSProperties}>
        <span className="ride-card-icon" aria-hidden="true">{here.icon}</span>
        <div>
          <strong>第 {stops.indexOf(here) + 1} 站 · {here.name}</strong>
          <p>{here.text}<Cite ids={here.cite} /></p>
        </div>
      </div>
    </>
  );
}
