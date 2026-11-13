import { useState, type CSSProperties } from 'react';
import { GEO } from '../map/geo';
import { MapArt } from '../map/MapArt';
import { Cite } from '../render/Cite';
import type { Show } from '../topics/types';

/** 站点四周留多少地图（地图单位），宽高比不低于这个，免得裁成一根细条 */
const PAD = 46;
const MIN_RATIO = 0.42;

/** 小地图上标出几个地铁站，点一下看那一站的故事 */
export function StationsShow({ show }: { show: Extract<Show, { kind: 'stations' }> }) {
  const at = show.items.map((it) => GEO.stations.find((s) => s.name === it.name));
  const xs = at.flatMap((s) => (s ? [s.x] : []));
  const ys = at.flatMap((s) => (s ? [s.y] : []));
  const x = Math.min(...xs) - PAD;
  const w = Math.max(...xs) + PAD - x;
  const h0 = Math.max(...ys) - Math.min(...ys) + PAD * 2;
  const h = Math.max(h0, w * MIN_RATIO);
  const y = (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2;
  const pct = (px: number, py: number) => ({ left: `${((px - x) / w) * 100}%`, top: `${((py - y) / h) * 100}%` });

  const [i, setI] = useState(0);
  const item = show.items[i];

  return (
    <>
      <div className="ride-map" style={{ aspectRatio: `${w} / ${h}` }}>
        <MapArt viewBox={`${x} ${y} ${w} ${h}`} moving={false} className="ride-art station-art" />
        {show.items.map((it, k) => {
          const s = at[k];
          return s && (
            <button key={it.name} type="button" className={`ride-stop station-pin ${k === i ? 'here' : ''}`} style={pct(s.x, s.y)}
              aria-label={`${it.name}站`} onClick={() => setI(k)}>{k + 1}</button>
          );
        })}
      </div>
      <p className="tide-note">点地图上的数字，看每个站的名字是怎么来的。实线是地面上的地铁，点点线是地下的地铁。</p>
      <div className="ride-card" key={item.name} style={{ '--i': 0 } as CSSProperties}>
        <span className="ride-card-icon" aria-hidden="true">🚉</span>
        <div>
          <strong>{i + 1} · {item.name}站</strong>
          <p>{item.text}<Cite ids={item.cite} /></p>
        </div>
      </div>
    </>
  );
}
